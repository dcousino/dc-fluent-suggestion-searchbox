import {
  Callout,
  DirectionalHint,
  FocusZone,
  IProgressIndicatorStyles,
  ISearchBoxProps,
  ProgressIndicator,
  SearchBox,
  IFocusZone,
  FocusZoneDirection,
  FocusZoneTabbableElements,
  Link,
  mergeStyleSets,
  getId,
} from "@fluentui/react";
import React, { ReactElement } from "react";
import SuggestionView from "./SuggestionView";

type SuggestionSearchBoxProps = ISearchBoxProps & {
  suggestions?: string[];
  onSuggestionClicked: (suggestion: string) => void;
  inProgress?: boolean;
  debounceTime?: number;
};
const SuggestionSearchBox = (props: SuggestionSearchBoxProps) => {
  const textInput = React.useRef<HTMLDivElement>(null);
  const [isCalloutFocused, setCalloutFocused] = React.useState(false);
  const [isCallOutVisible, setIsCallOutVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const focusZoneRef = React.useRef<IFocusZone>(null);
  const [suggestions, setSuggestions] = React.useState<string[]>();
  const [suggestionClicked, setSuggestionClicked] = React.useState(false);
  const focusZoneId = getId("focusZone");
  React.useEffect(() => {
    setSuggestions(props.suggestions);
    setIsCallOutVisible(props.suggestions !== undefined);
  }, [props.suggestions]);

  React.useEffect(() => {
    setIsLoading(props.inProgress === true ? true : false);
  }, [props.inProgress]);

  const ProgressIndicatorStyle: Partial<IProgressIndicatorStyles> = {
    itemProgress: {
      paddingBottom: "4px",
    },
  };

  const getCalloutWidth = () => {
    const calloutWidth = textInput.current?.offsetWidth;
    return calloutWidth + "px";
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setSuggestionClicked(false);
    setIsCallOutVisible(false);
    if (props.onFocus) props.onFocus(event);
  };

  const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "ArrowDown") {
      setCalloutFocused(true);
      focusZoneRef.current?.focus();
      ev.preventDefault();
    } else {
      setCalloutFocused(false);
    }
  };

  const renderProgressIndicator = () => {
    if (isLoading) {
      return <ProgressIndicator styles={ProgressIndicatorStyle} />;
    }
    return null;
  };

  const onSuggestionClicked = (suggestion: string) => {
    const query = suggestion;
    setSuggestionClicked(true);
    setQuery(query);
    props.onSuggestionClicked(suggestion);
    setIsCallOutVisible(false);
  };

  const renderSuggestions = (): ReactElement | ReactElement[] => {
    const views: JSX.Element[] = [];
    if (!suggestions) return <></>;
    suggestions.forEach((suggestion: string, i: number) => {
      views.push(getDefaultListItem(suggestion, i));
    });

    return views;
  };

  const suggestionStyle = mergeStyleSets({
    root: {
      width: "100%",
      padding: "5px",
      color: "black",
      "&:hover": {
        textDecoration: "none",
        backgroundColor: "#c7c7c7",
        color: "black",
      },
      "&:active": {
        textDecoration: "none",
        backgroundColor: "#c7c7c7",
        color: "black",
      },
      "&:focus": {
        textDecoration: "none",
        backgroundColor: "#c7c7c7",
        color: "black",
      },
    },
  });

  const getDefaultListItem = (suggestion: string, key: any) => {
    return (
      <div key={key}>
        <Link
          onClick={(e) => onSuggestionClicked(suggestion)}
          className={suggestionStyle.root}
          role="link"
        >
          <SuggestionView text={suggestion} filter={query}></SuggestionView>
        </Link>
      </div>
    );
  };

  const onCallOutDismiss = () => {
    setIsCallOutVisible(false);
  };

  const onChange = (
    _?: React.ChangeEvent<HTMLInputElement> | undefined,
    newValue?: string | undefined
  ) => {
    setSuggestionClicked(false);
    setQuery(newValue || "");
  };

  React.useEffect(() => {
    if (props.onChange) {
      const timeOutId = setTimeout(async () => {
        if (props.onChange && !suggestionClicked)
          props.onChange(undefined, query);
      }, props.debounceTime || 0);
      return () => {
        clearTimeout(timeOutId);
      };
    }
  }, [query]);

  return (
    <>
      <div ref={textInput} className={props.className}>
        <SearchBox
          {...props}
          autoComplete="off"
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          value={query}
        ></SearchBox>
      </div>

      {isLoading ||
        (suggestions !== undefined && isCallOutVisible && (
          <Callout
            style={{ width: getCalloutWidth() }}
            isBeakVisible={false}
            target={textInput.current}
            onDismiss={onCallOutDismiss}
            directionalHint={DirectionalHint.bottomLeftEdge}
            directionalHintForRTL={DirectionalHint.bottomRightEdge}
            setInitialFocus={isCalloutFocused}
            doNotLayer={true}
          >
            {renderProgressIndicator()}
            <FocusZone
              direction={FocusZoneDirection.bidirectional}
              handleTabKey={FocusZoneTabbableElements.all}
              id={focusZoneId}
              componentRef={focusZoneRef}
            >
              {renderSuggestions()}
            </FocusZone>
          </Callout>
        ))}
    </>
  );
};

export default SuggestionSearchBox;
