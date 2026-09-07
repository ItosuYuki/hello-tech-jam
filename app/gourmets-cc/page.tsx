"use client";
 
import { useState } from "react";
import { Shop } from "@/types";
import SearchForm from "./search-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 
export default function GourmetsClientPage() {
  const [shops, setShops] = useState<Shop[]>([]);
 
  const handleSearchResults = (results: Shop[]) => {
    setShops(results);
  };
 
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-36 px-8 md:px-12 lg:px-16">
      <div className="absolute top-4 right-4">
      </div>
      <SearchForm onSearchResults={handleSearchResults} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        {shops.length > 0 ? (
          shops.map((shop) => (
            <Card key={shop.id}>
              <CardHeader className="space-y-4 p-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={shop.photo.pc.m} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle>{shop.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{shop.address || "住所情報なし"}</p>
                <p>{shop.genre?.name || "ジャンル情報なし"}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>店舗が見つかりません</p>
        )}
      </div>
    </div>
  );
}