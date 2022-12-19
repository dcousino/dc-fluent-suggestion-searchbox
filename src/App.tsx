import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SuggestionSearchBox from "./features/SuggestionSearchBox/SuggestionSearchBox";
import { mergeStyleSets, Stack } from "@fluentui/react";

function App() {
  const christmasSongs = [
    "Jingle Bells",
    "Silent Night",
    "Deck the Halls",
    "Joy to the World",
    "The First Noel",
    "O Holy Night",
    "We Wish You a Merry Christmas",
    "O Come All Ye Faithful",
    "Hark! The Herald Angels Sing",
    "It Came Upon a Midnight Clear",
    "Away in a Manger",
    "O Little Town of Bethlehem",
    "God Rest Ye Merry Gentlemen",
    "Angels We Have Heard on High",
    "Good King Wenceslas",
    "What Child is This?",
    "O Come, O Come, Emmanuel",
    "The Twelve Days of Christmas",
    "I Heard the Bells on Christmas Day",
    "Up on the Housetop",
  ];
  const [suggestions, setSuggestions] = React.useState<string[]>();
  const onChange = (newText?: string) => {
    if (!newText || newText.trim() === "") {
      setSuggestions(undefined);
    } else {
      setSuggestions(
        christmasSongs.filter((song) =>
          song.toLowerCase().includes(newText.toLowerCase())
        )
      );
    }
  };
  const classNames = mergeStyleSets({
    root: {
      minWidth: "220px",
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Stack tokens={{ childrenGap: 12 }}>
        <Stack horizontal verticalAlign="end" horizontalAlign="center">
          <SuggestionSearchBox
            className={classNames.root}
            onSuggestionClicked={(e) => {
              console.log(`clicked ${e}`);
            }}
            onChange={(_, newValue) => {
              onChange(newValue);
            }}
            suggestions={suggestions}
          ></SuggestionSearchBox>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
