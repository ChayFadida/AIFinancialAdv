import { render, screen } from "@testing-library/react";
import { Messages } from "./Messages";
import { ThemeProvider, createTheme } from "@mui/material";
import { Message } from "../types";

describe("Messages Component", () => {
  const theme = createTheme();

  const mockMessages: Message[] = [
    {
      content: "Hello, how can I help you?",
      sender: "bot",
      timestamp: new Date("2024-01-01T10:00:00.000Z"),
    },
    {
      content: "I have a question",
      sender: "user",
      timestamp: new Date("2024-01-01T10:01:00.000Z"),
    }
  ];

  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it("renders messages correctly", () => {
    renderWithTheme(<Messages messages={mockMessages} />);

    expect(screen.getByText("Hello, how can I help you?")).toBeInTheDocument();
    expect(screen.getByText("I have a question")).toBeInTheDocument();
  });

  it("displays timestamps", () => {
    renderWithTheme(<Messages messages={mockMessages} />);

    const timestamps = screen.getAllByText(/\d{1,2}:\d{2}\s?[AP]M/i);
    expect(timestamps).toHaveLength(2);
  });

  it("renders bot avatar for bot messages", () => {
    renderWithTheme(<Messages messages={mockMessages} />);

    const botIcons = screen.getAllByTestId("SmartToyIcon");
    expect(botIcons).toHaveLength(1);
  });

  it("renders user avatar for user messages", () => {
    renderWithTheme(<Messages messages={mockMessages} />);

    const userIcons = screen.getAllByTestId("PersonIcon");
    expect(userIcons).toHaveLength(1);
  });

  it("renders empty state when no messages", () => {
    renderWithTheme(<Messages messages={[]} />);

    expect(screen.queryByTestId("SmartToyIcon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("PersonIcon")).not.toBeInTheDocument();
  });

  it("preserves message whitespace", () => {
    const messagesWithWhitespace: Message[] = [{
      content: "Line 1\nLine 2\n  Line 3",
      sender: "bot",
      timestamp: new Date("2024-01-01T10:00:00.000Z")
    }];

    renderWithTheme(<Messages messages={messagesWithWhitespace} />);

    const message = screen.getByText((content) => content.includes("Line 1"));
    expect(message).toHaveStyle({ whiteSpace: "pre-wrap" });
  });

  it("applies correct colors based on sender", () => {
    const { container } = renderWithTheme(<Messages messages={mockMessages} />);
    
    // Find Paper components using class selector
    const papers = container.querySelectorAll('.MuiPaper-root');
    const [botPaper, userPaper] = Array.from(papers);

    // Bot message should have default background
    expect(botPaper).toHaveStyle({
      backgroundColor: theme.palette.background.default
    });

    // User message should have primary color background
    expect(userPaper).toHaveStyle({
      backgroundColor: theme.palette.primary.main
    });
  });
});
