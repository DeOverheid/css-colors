import type { Ref, ComputedRef } from "vue";

export interface FieldDefinition {
    id: string;
    label: string;
    type: "range" | "number" | "text";
    min?: number;
    max?: number;
    step?: number;
    value: Ref<number>;
    unit?: string;
}

export interface StepContent {
    title: string;
    subtitle?: string;
    description: string;
    fields: FieldDefinition[];
}

export interface StepDefinition {
    id: string;
    content: ComputedRef<StepContent>;
}

export interface StepState {
    isActive: boolean;
    isComplete: boolean;
}
