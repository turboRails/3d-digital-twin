import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

const cardList = [
  {
    title: "Card Title",
    description: "Card Description",
    content: "Card Content",
  },
  {
    title: "Card Title",
    description: "Card Description",
    content: "Card Content",
  },
  {
    title: "Card Title",
    description: "Card Description",
    content: "Card Content",
  },
  {
    title: "Card Title",
    description: "Card Description",
    content: "Card Content",
  },
  {
    title: "Card Title",
    description: "Card Description",
    content: "Card Content",
  },
  {
    title: "Card Title",
    description: "Card Description",
    content: "Card Content",
  },
  {
    title: "Card Title",
    description: "Card Description",
    content: "Card Content",
  },
]

export function CardList() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {cardList.map((card, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardContent>{card.content}</CardContent>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
