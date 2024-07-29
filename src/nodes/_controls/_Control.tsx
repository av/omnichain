import { useCallback, useEffect, useMemo, useState } from "react";
import { ClassicPreset } from "rete";

import { graphStorage, updateNodeControl } from "../../state/graphs";
import { executorStorage } from "../../state/executor";
import { useOuterState } from "../../util/ObservableUtilsReact";
import { controlObservable } from "../../state/watcher";
import { nodeContentVisibleState } from "../../state/editor";

export const useControlState = <T extends string | number | null>(
    graphId: string,
    nodeId: string,
    controlName: string,
    initValue: T
) => {
    const [value, _setValue] = useState<T>(initValue);

    const [executor] = useOuterState(executorStorage);

    const [debouncer, setDebouncer] = useState<NodeJS.Timeout | null>(null);

    const disabled = useMemo(
        () => !!executor && executor.graphId === graphId,
        [executor, graphId]
    );

    const [visible] = useOuterState(nodeContentVisibleState);

    const setValue = useCallback(
        (v: T) => {
            if (disabled) return;

            _setValue(v);

            if (debouncer) {
                clearTimeout(debouncer);
            }

            setDebouncer(
                setTimeout(() => {
                    void updateNodeControl(
                        graphId,
                        nodeId,
                        controlName,
                        v as any
                    );
                }, 250)
            );
        },
        [controlName, disabled, graphId, nodeId, debouncer]
    );

    // Keep track of external value updates
    useEffect(() => {
        const valUnsub = controlObservable.subscribe(
            ({
                graphId: _graphId,
                node: _nodeId,
                control: _controlName,
                value,
            }) => {
                if (
                    _graphId === graphId &&
                    _nodeId === nodeId &&
                    _controlName === controlName
                ) {
                    _setValue(value as T);
                }
            }
        );

        return () => {
            valUnsub();
        };
    }, [controlName, graphId, nodeId]);

    return { value, setValue, disabled, hidden: graphId !== visible };
};

export abstract class BaseControl<VALUE, CONFIG> extends ClassicPreset.Control {
    public value: VALUE;

    constructor(
        public graphId: string,
        public nodeId: string,
        public controlName: string,
        public defaultValue: VALUE,
        public config: CONFIG,
        public readOnly = false
    ) {
        super();
        this.value = this.grabValue();
    }

    grabValue(): VALUE {
        const graph = graphStorage.get()[this.graphId];
        const nodeData = graph.nodes.find((n) => n.nodeId === this.nodeId);
        const controls = nodeData?.controls;
        if (!controls) return this.defaultValue;
        return (controls[this.controlName] ?? this.defaultValue) as VALUE;
    }

    abstract component(): React.FC;
}
