"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";

interface Tools {
  id: string;
  user_id: string;
  name: string;
  created_at: Date;
}

const page = () => {
  const supabase = createClient();

  const [tools, setTools] = useState<Tools[]>();
  const toolsRef = useRef<HTMLInputElement>(null);
  const fetchTools = useCallback(async () => {
    const { data } = await supabase.from("tools").select("*");
    setTools(data as Tools[]);
    console.log(data);
  }, []);

  const handleAdd = useCallback(async () => {
    await supabase.from("tools").insert({
      name: toolsRef.current?.value,
    });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await supabase.from("tools").delete().eq("id", id);
  }, []);
  useEffect(() => {
    fetchTools();
  }, []);
  return (
    <div className=" flex gap-3 justify-between m-12">
      <Button onClick={() => fetchTools()}>Sync</Button>
      <div className=" p-4 border border-neutral-500 rounded-xl flex gap-5">
        <Input placeholder="Name of tool" ref={toolsRef} />
        <br />
        <Button onClick={() => handleAdd()}>Add tool</Button>
      </div>
      <div className="border p-4 flex justify-center flex-col gap-2 rounded-xl border-neutral-500">
        {tools?.map((tool) => (
          <span key={tool.id} className="flex gap-2">
            {tool.name}
            <span>{new Date(tool.created_at).toDateString()}</span>
            <Button onClick={() => handleDelete(tool.id)}>Delete</Button>
          </span>
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default page;
