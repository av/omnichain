import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { ClassicScheme, RenderEmit, Presets } from "rete-react-plugin";

import { getMenuIcon } from "./NodeIcons";
import { BtnDoc } from "./BtnDoc";
import { useOuterState } from "../../util/ObservableUtilsReact";
import { executorStorage, lastNodeErrorStorage } from "../../state/executor";
import { nodeContentVisibleState } from "../../state/editor";

const SOCKET_MARGIN = 6;
const SOCKET_SIZE = 25;

const { RefSocket, RefControl } = Presets.classic;

export const StyledSocket = styled.div`
    display: inline-block;
    cursor: pointer;
    width: ${SOCKET_SIZE}px;
    height: ${SOCKET_SIZE}px;
    border-radius: 25px;
    margin: 0;
    vertical-align: middle;
    background: #fff;
    z-index: 2;
    box-sizing: border-box;
    &:hover {
        background: #ffc53d;
    }
`;

type NodeExtraData = {
    width?: number;
    height?: number;
};

type WrapperProps = {
    selected?: boolean;
    disabled?: boolean;
    styles?: (props: any) => any;
};

const StyledWrapper = styled.div<NodeExtraData & WrapperProps>`
    background-color: #1677ff;
    cursor: pointer;
    box-sizing: border-box;
    padding-bottom: 6px;
    border: 6px solid #1677ff;
    border-radius: 10px;
    width: ${(props) =>
        Number.isFinite(props.width) && props.width
            ? `${props.width.toString()}px`
            : "200px"};
    height: ${(props) =>
        Number.isFinite(props.height) && props.height
            ? `${props.height.toString()}px`
            : "auto"};
    position: relative;
    user-select: none;
    ${(props) =>
        props.selected &&
        css`
            border-color: #fff1b8;
        `}

    .output {
        text-align: right;
    }
    .input {
        text-align: left;
    }
    .output-socket {
        text-align: right;
        margin-right: -14px;
        display: inline-block;
    }
    .input-socket {
        text-align: left;
        margin-left: -14px;
        display: inline-block;
    }
    .input-title,
    .output-title {
        vertical-align: middle;
        color: white;
        display: inline-block;
        font-family: sans-serif;
        font-size: 14px;
        margin: ${SOCKET_MARGIN}px;
        line-height: ${SOCKET_SIZE}px;
    }
    .input-control {
        z-index: 1;
        width: calc(100% - ${SOCKET_SIZE + 2 * SOCKET_MARGIN}px);
        vertical-align: middle;
        display: inline-block;
    }
    .control {
        display: block;
        height: auto;
        padding: ${SOCKET_MARGIN}px ${SOCKET_SIZE / 2 + SOCKET_MARGIN}px;
    }
    ${
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (props) => props.styles && props.styles(props)
    }
`;

function sortByIndex<T extends [string, undefined | { index?: number }][]>(
    entries: T
) {
    const sorted = [...entries];
    sorted.sort((a, b) => {
        const ai = a[1]?.index || 0;
        const bi = b[1]?.index || 0;

        return ai - bi;
    });
    return sorted;
}

type Props<S extends ClassicScheme> = {
    data: S["Node"] & NodeExtraData;
    styles?: () => any;
    emit: RenderEmit<S>;
};

/**
 * Used to indicate either node activity, or an error in the node.
 */
export const GlowIndicator: React.FC<{ node: any }> = (props) => {
    const [lastNodeError] = useOuterState(lastNodeErrorStorage);
    const [executor] = useOuterState(executorStorage);

    const isActive = useMemo(() => {
        if (!executor) return false;
        return (
            executor.graphId === props.node.graphId &&
            executor.step === props.node.id
        );
    }, [executor, props.node.graphId, props.node.id]);

    const errMessage: string | null = useMemo(() => {
        if (
            lastNodeError &&
            lastNodeError.graphId === props.node.graphId &&
            lastNodeError.nodeId === props.node.id
        ) {
            return lastNodeError.error.trim();
        }
        return null;
    }, [lastNodeError, props.node.graphId, props.node.id]);

    return (
        <div
            style={{
                display: errMessage?.length || isActive ? "block" : "none",
                position: "absolute",
                top: -6,
                left: -6,
                right: -6,
                bottom: -6,
                zIndex: -1,
                borderRadius: "10px",
                pointerEvents: "none",
                boxSizing: "border-box",
                animation: errMessage?.length
                    ? "glowRed 1.2s ease-in infinite"
                    : "glowYellow 1.2s ease-in infinite",
            }}
        ></div>
    );
};

export const SocketTitle: React.FC<{
    node: any;
    title: string;
    type: "output" | "input";
}> = ({ node, title, type }) => {
    const [visible] = useOuterState(nodeContentVisibleState);

    const _title = useMemo(
        () => (visible !== node.graphId ? "" : title),
        [visible, title, node.graphId]
    );

    return (
        <div
            className={`${type}-title`}
            data-testid={`${type}-title`}
            style={{ height: "26px" }}
        >
            {_title}
        </div>
    );
};

export const CustomNodeTitle: React.FC<{ node: any }> = ({ node }) => {
    const [visible] = useOuterState(nodeContentVisibleState);

    const cleanLabel = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return node.label.replace(/Node$/, "").trim();
    }, [node.label]);

    const icon = useMemo(() => {
        return getMenuIcon(node.label);
    }, [node.label]);

    if (visible !== node.graphId) return null;

    return (
        <div
            // className="title"
            // data-testid="title"
            style={{
                width: "100%",
                height: "100%",
                color: "white",
                fontFamily: "sans-serif",
                fontSize: "18px",
                paddingLeft: "10px",
                paddingRight: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <div>
                {icon}
                <span style={{ paddingLeft: "5px" }}>{cleanLabel}</span>
            </div>

            <BtnDoc node={node.customNodeData} />
        </div>
    );
};

export function CustomNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
    const inputs = useMemo(
        () => sortByIndex(Object.entries(props.data.inputs)),
        [props.data.inputs]
    );

    const outputs = useMemo(
        () => sortByIndex(Object.entries(props.data.outputs)),
        [props.data.outputs]
    );

    const controls = useMemo(
        () => sortByIndex(Object.entries(props.data.controls)),
        [props.data.controls]
    );

    return (
        <StyledWrapper
            id={props.data.id}
            data-context-menu={props.data.id}
            selected={props.data.selected || false}
            width={props.data.width}
            height={props.data.height}
            styles={props.styles}
        >
            {/* <ExecutionIndicator node={props.data} /> */}
            <GlowIndicator node={props.data} />
            <div
                style={{
                    width: "100%",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CustomNodeTitle node={props.data} />
            </div>
            {/* Outputs */}
            {outputs.map(
                ([key, output]) =>
                    output && (
                        <div
                            className="output"
                            key={key}
                            data-testid={`output-${key}`}
                        >
                            {/* <div
                                className="output-title"
                                data-testid="output-title"
                            >
                                {output.label}
                            </div> */}
                            <SocketTitle
                                node={props.data}
                                title={output.label || ""}
                                type="output"
                            />
                            <RefSocket
                                name="output-socket"
                                side="output"
                                emit={props.emit}
                                socketKey={key}
                                nodeId={props.data.id}
                                payload={output.socket}
                                data-testid="output-socket"
                            />
                        </div>
                    )
            )}
            {/* Inputs */}
            {inputs.map(
                ([key, input]) =>
                    input && (
                        <div
                            className="input"
                            key={key}
                            data-testid={`input-${key}`}
                        >
                            <RefSocket
                                name="input-socket"
                                emit={props.emit}
                                side="input"
                                socketKey={key}
                                nodeId={props.data.id}
                                payload={input.socket}
                                data-testid="input-socket"
                            />
                            {(!input.control || !input.showControl) && (
                                // <div
                                //     className="input-title"
                                //     data-testid="input-title"
                                // >
                                //     {input.label}
                                // </div>
                                <SocketTitle
                                    node={props.data}
                                    title={input.label || ""}
                                    type="input"
                                />
                            )}
                            {input.control && input.showControl && (
                                <span className="input-control">
                                    <RefControl
                                        key={key}
                                        name="input-control"
                                        emit={props.emit}
                                        payload={input.control}
                                        data-testid="input-control"
                                    />
                                </span>
                            )}
                        </div>
                    )
            )}
            {controls.map(([key, control]) => {
                return control ? (
                    <RefControl
                        key={key}
                        name="control"
                        emit={props.emit}
                        payload={control}
                        data-testid={`control-${key}`}
                    />
                ) : null;
            })}
        </StyledWrapper>
    );
}
