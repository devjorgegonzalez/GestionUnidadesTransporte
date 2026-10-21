export declare class ItemTareaDto {
    codigo?: string;
    nombre: string;
    seleccionada: boolean;
}
export declare class CreateMantenimientoDto {
    utId: string;
    tareasChecklist: ItemTareaDto[];
    tareasManuales?: ItemTareaDto[];
}
