"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Save, Trash2, Copy, Play } from "lucide-react";
import Footer from "@/components/Footer";

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
}

interface SavedEndpoint {
  id: string;
  url: string;
  method: string;
  body?: string;
  name: string;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedEndpoints, setSavedEndpoints] = useState<SavedEndpoint[]>([]);
  const [endpointName, setEndpointName] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const responseVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  // Load saved endpoints from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("starapi-endpoints");
    if (saved) {
      try {
        setSavedEndpoints(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load saved endpoints:", err);
      }
    }
  }, []);

  // Save endpoints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("starapi-endpoints", JSON.stringify(savedEndpoints));
  }, [savedEndpoints]);

  const saveEndpoint = () => {
    if (!url.trim()) return;

    const name = endpointName.trim() || `${method} ${url}`;
    const newEndpoint: SavedEndpoint = {
      id: Date.now().toString(),
      url,
      method,
      body: body.trim() || undefined,
      name,
    };

    setSavedEndpoints(prev => [...prev, newEndpoint]);
    setEndpointName("");
  };

  const loadEndpoint = (endpoint: SavedEndpoint) => {
    setUrl(endpoint.url);
    setMethod(endpoint.method);
    setBody(endpoint.body || "");
  };

  const copyEndpoint = async (endpoint: SavedEndpoint) => {
    const textToCopy = `${endpoint.method} ${endpoint.url}${endpoint.body ? '\n' + endpoint.body : ''}`;
    await navigator.clipboard.writeText(textToCopy);
  };

  const runEndpoint = async (endpoint: SavedEndpoint) => {
    setUrl(endpoint.url);
    setMethod(endpoint.method);
    setBody(endpoint.body || "");
    
    // Wait a tick for state to update, then send request
    setTimeout(async () => {
      setLoading(true);
      setError("");
      setResponse(null);

      try {
        const options: RequestInit = {
          method: endpoint.method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (endpoint.method !== "GET" && endpoint.method !== "HEAD" && endpoint.body) {
          options.body = endpoint.body;
        }

        const res = await fetch(endpoint.url, options);
        const data = await res.text();

        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch {
          parsedData = data;
        }

        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
          data: parsedData,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const deleteEndpoint = (id: string) => {
    setSavedEndpoints(prev => prev.filter(ep => ep.id !== id));
  };

  const sendRequest = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET" && method !== "HEAD" && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.text();

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = data;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: parsedData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen relative flex flex-col" 
      style={{ backgroundImage: 'url(/stars.avif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 z-0 dark:hidden" style={{ backgroundImage: 'url(/stars.avif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', filter: 'invert(1)' }}></div>
      <div className="absolute inset-0 z-[1] bg-white/90 dark:bg-neutral-900/97"></div>
      <motion.div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1">
        <motion.header 
          className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          variants={cardVariants}
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              StarAPI
            </motion.h1>
            <ThemeToggle />
          </div>
        </motion.header>

        <motion.div 
          className="container mx-auto p-4 max-w-6xl"
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <Card className="mb-6 backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20">
              <CardHeader>
                <CardTitle>Request</CardTitle>
                <CardDescription>Configure your API request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="HEAD">HEAD</SelectItem>
                      <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Enter API URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={sendRequest} disabled={loading || !url}>
                      {loading ? "Sending..." : "Send"}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={saveEndpoint} disabled={!url.trim()} variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </motion.div>
                </div>

                {(method === "POST" || method === "PUT" || method === "PATCH") && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Request Body (JSON)</label>
                    <Textarea
                      placeholder="Enter JSON body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={6}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6 backdrop-blur-lg bg-red-500/10 border-red-500/30">
                  <CardContent className="pt-6">
                    <p className="text-red-600">Error: {error}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {response && (
              <motion.div
                variants={responseVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20">
                  <CardHeader>
                    <CardTitle>Response</CardTitle>
                    <CardDescription>
                      Status: {response.status} {response.statusText}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="body" className="w-full">
                      <TabsList>
                        <TabsTrigger value="body">Body</TabsTrigger>
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                      </TabsList>
                      <TabsContent value="body" className="mt-4">
                        <motion.pre 
                          className="bg-white dark:bg-neutral-900 p-4 rounded overflow-auto max-h-96"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {typeof response.data === "string"
                            ? response.data
                            : JSON.stringify(response.data, null, 2)}
                        </motion.pre>
                      </TabsContent>
                      <TabsContent value="headers" className="mt-4">
                        <motion.pre 
                          className="bg-white dark:bg-neutral-900 p-4 rounded overflow-auto max-h-96"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {JSON.stringify(response.headers, null, 2)}
                        </motion.pre>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {savedEndpoints.length > 0 && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="mt-6 backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20">
                  <CardHeader>
                    <CardTitle>Saved Endpoints</CardTitle>
                    <CardDescription>Your saved API endpoints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="space-y-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <AnimatePresence>
                        {savedEndpoints.map((endpoint, index) => (
                          <motion.div 
                            key={endpoint.id} 
                            className="flex items-center justify-between p-3 border rounded-lg backdrop-blur-sm bg-white/5 dark:bg-black/10 border-white/10"
                            variants={cardVariants}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex-1">
                              <motion.button
                                onClick={() => loadEndpoint(endpoint)}
                                className="text-left hover:text-blue-600 dark:hover:text-blue-400 w-full"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <div className="font-medium">{endpoint.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {endpoint.method} {endpoint.url}
                                </div>
                              </motion.button>
                            </div>
                            <div className="flex gap-1">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  onClick={() => runEndpoint(endpoint)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  onClick={() => copyEndpoint(endpoint)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  onClick={() => deleteEndpoint(endpoint.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-stone-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
        </main>
        <Footer />
      </motion.div>
    </motion.div>
  );
}