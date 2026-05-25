import { Card, Chip, Input } from '@heroui/react';
import { config } from '@/lib/config';

export default async function Home() {
  console.log(config.services.auth);
  let data = { status: 'offline' };
  try {
    const res = await fetch(`${config.services.auth}/health`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.warn("Auth service is offline during build or runtime:", error);
  }
  return (
    <div className="flex flex-col max-w-xl mx-auto mt-20">
      <h1 className="text-3xl font-bold">The Famous ERP</h1>
      <p>Status page</p>
      <ul>
        <li>
          <Card>
            <Card.Header>
              <Card.Title>Next.JS Project</Card.Title>
            </Card.Header>
            <Card.Content>
              Status:
              <Chip color="success">Online</Chip>
            </Card.Content>
          </Card>
          <Card className="mt-5">
            <Card.Header>
              <Card.Title>Backend Services</Card.Title>
            </Card.Header>
            <Card.Content>
              Auth Service:
              {data.status === 'ok' ? (
                <Chip color="success">Online</Chip>
              ) : (
                <Chip color="danger">Offline</Chip>
              )}
              Inventory Service:
              <Chip color="warning">Not implemented</Chip>
              Analytics Service:
              <Chip color="warning">Not implemented</Chip>
            </Card.Content>
          </Card>
          <div>
            <Input aria-label="Name" className="w-64" placeholder="Correo electronico" />;
          </div>
        </li>
      </ul>
    </div>
  );
}
