import React from "react";
import { BehaviorSubject } from "rxjs";
import { PregameScreen } from "../pregameScreen/pregameScreen";

export const mainContentStream$ = new BehaviorSubject(<PregameScreen cast={[]} />);

export class MainContentArea extends React.Component<{}, { content: any }> {
    // a simple class that displays whatever it gets fed through the main content stream.

    private contentStream: any;

    public constructor(props: any) {
        super(props);
        this.state = { content: null };
    }

    public componentWillMount() {
        this.contentStream = mainContentStream$.subscribe(content => {
            this.setState({ content });
        });
    }

    public componentDidUpdate(prevProps: never, prevState: any) {
        if (prevState.content !== this.state.content) {
            window.scrollTo(0, 0);
        }
    }

    public componentWillUnmount() {
        this.contentStream.unsubscribe();
    }

    public render() {
        return <div className="box">{this.state.content}</div>;
    }
}
