"use client";
 
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
 
export default function Page() {
  const [keyword, setKeyword] = useState("");
 
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setKeyword(value);
    console.log(value);
  };
 
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("button click", keyword);
  };
 
  return (
    <div className="flex items-start justify-center pt-36">
      <div className="absolute top-4 right-4">
      </div>
      <form className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="検索..."
          onChange={handleInputChange}
          className="max-w-sm w-full"
        />
        <Button type="submit" onClick={handleButtonClick} className="max-w-sm">
          検索
        </Button>
      </form>
    </div>
  );
}