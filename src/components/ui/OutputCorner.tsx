import { useEffect, useState } from "react";
import { useResponseContext } from "../../contexts/ResponseContext";
import { outputCornerStyle } from "../../styles";
import { AnyContextType } from "../../types";
import { useRecursiveTimeout } from "../../utils/hooks";

var DELAYMS_DEFAULT = 1000;

const OutputCorner = () => {
    const [displayStatus, setDisplayStatus] = useState(true);
    const [outputText, setOutputText] = useState<string[]>([]);
    const [textIndex, setTextIndex] = useState(0);

    const responseContext: AnyContextType = useResponseContext();
    const { responseState, setResponseState } = responseContext;

    const lineText = responseState.lineText;
    const texts = responseState.outputText;

    useRecursiveTimeout(() => new Promise<void>((r) => {
        if (textIndex <= texts.length && texts[textIndex]) {
            setOutputText(outputText => [...outputText, texts[textIndex] + "\n"]);
            setTextIndex(textIndex + 1);
        }
        r();
    }), Math.floor(Math.random() * 500), 0);

    useEffect(() => {
        setDisplayStatus(true);
        
        var delayMS = DELAYMS_DEFAULT;
    
        if (lineText)
            delayMS = delayMS * 5;
        
        var outputTextTimeout = setTimeout(() => {
            setDisplayStatus(false);
            setOutputText([]);
            setTextIndex(0);
            setResponseState({ lineText: responseState.lineText, outputText: [] });
            clearTimeout(outputTextTimeout);
        }, texts.length * delayMS);
    }, [texts.length]);

    return (
        displayStatus ? <div style={outputCornerStyle.container}>
            <div style={outputCornerStyle.text}>{outputText}</div>
        </div> : <></>
    );
}

export default OutputCorner;