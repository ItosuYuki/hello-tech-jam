export default function Footer() {
  return (
    <footer className="bg-background border-t py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} Search Gourmet
          </p>
          
          <a
            href="https://webservice.recruit.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:underline"
          >
            Powered by ホットペッパーグルメ Webサービス
          </a>
        </div>
      </div>
    </footer>
  );
}