import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { spawn } from "node:child_process";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const MCP_TIMEOUT_MS = Number(process.env.MCP_TIMEOUT_MS || 30000);

export const mcpServers = {
  deals: {
    name: "RapidAPI Hub - BlipADeal Worldwide Deals",
    host: "blipadeal-blipadeal-world-wide-deals.p.rapidapi.com",
    toolHint: process.env.MCP_DEALS_TOOL || "",
  },
  freeCoupons: {
    name: "RapidAPI Hub - Free Coupon Codes",
    host: "cashnjoy-com-free-coupon-codes-v1.p.rapidapi.com",
    toolHint: process.env.MCP_FREE_COUPONS_TOOL || "",
  },
  linkMyDeals: {
    name: "RapidAPI Hub - LinkMyDeals Coupon Feed",
    host: "linkmydeals.p.rapidapi.com",
    toolHint: process.env.MCP_LINKMYDEALS_TOOL || "",
  },
  promoCodes: {
    name: "RapidAPI Hub - Get Promo Codes",
    host: "get-promo-codes.p.rapidapi.com",
    toolHint: process.env.MCP_PROMO_CODES_TOOL || "",
  },
};

function withTimeout(promise, ms = MCP_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`MCP timeout after ${ms}ms`)), ms)),
  ]);
}

function makeTransport(server) {
  if (!RAPIDAPI_KEY) throw new Error("RAPIDAPI_KEY is not configured");

  const args = [
    "mcp-remote",
    "https://mcp.rapidapi.com",
    "--header",
    `x-api-host: ${server.host}`,
    "--header",
    `x-api-key: ${RAPIDAPI_KEY}`,
  ];

  return new StdioClientTransport({
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args,
    stderr: "pipe",
  });
}

export async function connectMcpServer(server) {
  const client = new Client({ name: "acoupon", version: "2.0.0" });
  const transport = makeTransport(server);
  await withTimeout(client.connect(transport));
  return { client, transport };
}

export async function listMcpTools(server) {
  const connection = await connectMcpServer(server);
  try {
    const result = await withTimeout(connection.client.listTools());
    return (result.tools || []).map((tool) => ({
      name: tool.name,
      description: tool.description || "",
      inputSchema: tool.inputSchema || null,
    }));
  } finally {
    await connection.client.close().catch(() => {});
  }
}

function scoreTool(tool, keywords) {
  const haystack = `${tool.name} ${tool.description}`.toLowerCase();
  return keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0);
}

function selectTool(tools, server, keywords) {
  if (server.toolHint) {
    return tools.find((tool) => tool.name === server.toolHint) || null;
  }
  return [...tools]
    .map((tool) => ({ tool, score: scoreTool(tool, keywords) }))
    .sort((a, b) => b.score - a.score)[0]?.tool || null;
}

function buildArguments(tool, { category, query, limit = 25 } = {}) {
  const schema = tool.inputSchema || {};
  const properties = schema.properties || {};
  const args = {};

  const aliases = {
    category: ["category", "categories", "cat"],
    query: ["query", "q", "search", "keyword", "keywords", "term"],
    limit: ["limit", "count", "pageSize", "page_size", "size", "perPage", "per_page"],
  };

  for (const [valueName, names] of Object.entries(aliases)) {
    const value = valueName === "category" ? category : valueName === "query" ? query : limit;
    if (value == null || value === "") continue;
    const match = names.find((name) => Object.prototype.hasOwnProperty.call(properties, name));
    if (match) args[match] = value;
  }

  return args;
}

export async function callBestTool(server, options = {}) {
  const connection = await connectMcpServer(server);
  try {
    const toolsResult = await withTimeout(connection.client.listTools());
    const tools = toolsResult.tools || [];
    if (!tools.length) throw new Error("No MCP tools exposed by this server");

    const tool = selectTool(tools, server, options.keywords || ["coupon", "deal", "offer", "promo", "code", "store"]);
    if (!tool) throw new Error("No matching MCP tool found");

    const args = buildArguments(tool, options);
    const result = await withTimeout(connection.client.callTool({ name: tool.name, arguments: args }));
    return {
      server: server.name,
      tool: tool.name,
      arguments: args,
      result,
    };
  } finally {
    await connection.client.close().catch(() => {});
  }
}

export async function getMcpStatus() {
  const entries = await Promise.all(Object.entries(mcpServers).map(async ([id, server]) => {
    try {
      const tools = await listMcpTools(server);
      return {
        id,
        name: server.name,
        host: server.host,
        ok: true,
        tools: tools.map(({ name, description }) => ({ name, description })),
      };
    } catch (error) {
      return { id, name: server.name, host: server.host, ok: false, error: error.message };
    }
  }));
  return entries;
}
