import { Text } from "@fluentui/react";

const SuggestionView = ({ text, filter }: { text: string; filter: string }) => {
  if (filter === "") return <Text>{text}</Text>;
  try {
    const parts = text.split(new RegExp(`(${filter})`, "gi"));

    return (
      <>
        {parts.map((part, i) => (
          <Text
            key={i}
            style={
              part.toLowerCase() === filter.toLowerCase()
                ? { fontWeight: "bold" }
                : {}
            }
          >
            {part}
          </Text>
        ))}
      </>
    );
  } catch (error) {
    return <Text>{text}</Text>;
  }
};

export default SuggestionView;
