import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export type NewsArticle = {
  id: string;
  title: string;
  publishDate: Date | null;
  url: string;
  image: string;
};

type ArticleProps = {
  article: NewsArticle;
};

export const Article = ({ article }: ArticleProps) => {
  return (
    <Card>
      <CardActionArea
        onClick={() => window.open(article.url, "_blank")}
        sx={{ height: "100%" }}
      >
        <CardMedia
          component="img"
          height="140"
          image={article.image}
          alt={article.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {article.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {article.publishDate?.toDateString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
