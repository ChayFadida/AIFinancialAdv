import React, { useEffect, useRef, useState } from "react";
import { yahooAxios } from "../../services/axios/yahooAxios";
import { Box, CircularProgress } from "@mui/material";
import { Article, NewsArticle } from "./Article";
import { SidePanel } from "./SidePanel";

const SIDE_PANEL_WIDTH = 350;
const SPACING = 24;

export const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const containerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { bottom } = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;

        // Check if the bottom of the container is within the viewport
        setIsSticky(bottom <= viewportHeight);
      },
      { root: null, threshold: 0 } // Trigger when bottom enters the viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const getNews = async () => {
      try {
        setIsLoadingNews(true);
        const response = await yahooAxios.get("/news/list-by-symbol", {
          params: {
            s: "AAPL,GOOGL,TSLA",
            snippetCount: "51",
          },
        });

        const articles = response.data?.data?.main?.stream || [];

        const formattedArticles = articles.map((article: any) => {
          const { title, pubDate, clickThroughUrl, thumbnail } =
            article.content || {};

          return {
            id: article.id,
            title: title,
            publishDate: pubDate ? new Date(pubDate) : null,
            url: clickThroughUrl?.url,
            image: thumbnail?.resolutions?.[0]?.url,
          };
        });

        setNews(formattedArticles);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingNews(false);
      }
    };

    getNews();
  }, []);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%',
      minHeight: '100vh'
    }}>
      {isLoadingNews ? (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box 
          ref={containerRef}
          sx={{ 
            display: "flex",
            gap: `${SPACING}px`,
            position: "relative",
            maxWidth: '100%',
            overflow: 'visible',
            padding: '24px'
          }}
        >
          {/* Main content area */}
          <Box
            sx={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateColumns: {
                lg: "repeat(3, 1fr)",
                md: "repeat(2, 1fr)",
                sm: "repeat(1, 1fr)",
              },
              gap: 5,
              paddingBottom: 5,
              width: `calc(100% - ${SIDE_PANEL_WIDTH}px - ${SPACING}px)`,
            }}
          >
            {news.map((article) => (
              <Article key={article.id} article={article} />
            ))}
          </Box>

          {/* Side Panel */}
          <Box
            sx={{
              width: SIDE_PANEL_WIDTH,
              position: 'sticky',
              top: 24,
              height: 'calc(100vh - 48px)',
              alignSelf: 'flex-start',
              overflowY: 'auto',
              flexShrink: 0,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <SidePanel />
          </Box>
        </Box>
      )}
    </Box>
  );
};
