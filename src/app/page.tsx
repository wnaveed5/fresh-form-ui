"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface FieldItem {
  id: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  type?: string;
}

function SortableField({ item }: { item: FieldItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
        <Label htmlFor={item.id} className="flex-1">{item.label}</Label>
      </div>
      <Input 
        id={item.id} 
        defaultValue={item.defaultValue}
        placeholder={item.placeholder}
        type={item.type}
        className="cursor-text"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function Home() {
  const [fields, setFields] = useState<FieldItem[]>([
    {
      id: "name",
      label: "Name",
      placeholder: "Enter your name",
      defaultValue: "Pedro Duarte",
    },
    {
      id: "username",
      label: "Username",
      placeholder: "Enter username",
      defaultValue: "@peduarte",
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Drag fields to reorder them.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {fields.map((field) => (
                        <SortableField key={field.id} item={field} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">Current password</Label>
                  <Input id="tabs-demo-current" type="password" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">New password</Label>
                  <Input id="tabs-demo-new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your profile information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <Input id="profile-bio" placeholder="Tell us about yourself" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="profile-location">Location</Label>
                  <Input id="profile-location" placeholder="Where are you located?" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="profile-website">Website</Label>
                  <Input id="profile-website" type="url" placeholder="https://your-website.com" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
