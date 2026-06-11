import { Card } from "@heroui/react";

export function TotalCard({ title = "Total mensual estimado", total }: { title?: string; total: number }) {
    return (
        <Card className="flex flex-row items-center justify-between p-4">
            <Card.Header>
                <Card.Title className="font-semibold text-base">{title}</Card.Title>
            </Card.Header>
            <Card.Footer className="mt-auto">
                <span className="text-xl font-bold text-surface-foreground">${total}</span>
            </Card.Footer>
        </Card>
    );
}