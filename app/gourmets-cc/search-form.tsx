"use client";
 
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shop } from "@/types";
import React from "react";
 
type State = {
  results: Shop[];
  error?: {
    message: string;
    code: string;
  };
};
 
const initialState: State = {
  results: [],
  error: undefined,
};
 
async function searchAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const keyword = formData.get("keyword");
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword.toString());
 
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
    );
 
    if (!res.ok) {
      return {
        ...prevState,
        error: {
          message: "検索に失敗しました",
          code: "SEARCH_FAILED",
        },
      };
    }
 
    const data = await res.json();
    return {
      results: data,
      error: undefined,
    };
  } catch (error) {
    console.log(error);
    return {
      ...prevState,
      error: {
        message: "予期せぬエラーが発生しました",
        code: "UNKNOWN_ERROR",
      },
    };
  }
}
 
interface SearchFormProps {
  onSearchResults: (results: Shop[], query: string) => void;
}
 
export default function SearchForm({ onSearchResults }: SearchFormProps) {
  const [state, formAction, isPending] = useActionState(
    searchAction,
    initialState
  );
 
  React.useEffect(() => {
    if (state.results.length > 0) {
      onSearchResults(state.results, "");
    }
  }, [state.results, onSearchResults]);
 
  return (
    <form
      action={formAction}
      className="flex items-center justify-center space-x-4 mb-8"
    >
      <Input
        type="search"
        name="keyword"
        placeholder="検索..."
        defaultValue=""
        className="max-w-sm w-full"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "検索中..." : "検索"}
      </Button>
      {state.error && (
        <p className="text-red-500 mt-2">
          {state.error.message} (Code: {state.error.code})
        </p>
      )}
    </form>
  );
}