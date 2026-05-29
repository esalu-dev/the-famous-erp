import { Card } from "@heroui/react";

export function TotalCard({ total }: { total: number }) {
    return (
        <Card className="flex flex-row items-center justify-between p-4">
            <Card.Header>
                <Card.Title className="font-semibold text-base">Total mensual estimado</Card.Title>
            </Card.Header>
            <Card.Footer className="mt-auto">
                <span className="text-xl font-bold text-surface-foreground">${total}</span>
            </Card.Footer>
        </Card>
    );
}