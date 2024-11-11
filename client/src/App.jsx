"use client";

import React, { useState } from "react";
import { Button } from "./components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card.jsx";
import { Input } from "./components/ui/input.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "./components/ui/table.jsx";
import { SidebarProvider } from "./components/ui/sidebar.jsx";
import { Upload, User, Home, BarChart, Settings, LogOut } from "lucide-react";

export default function DashboardPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [images, setImages] = useState([]); // State to store image URLs

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPlayerName(null);
        setStatistics({});
        setImages([]); // Clear images when a new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognizePlayer = async () => {
    if (!imagePreview) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    const fileInput = document.getElementById("player-image");
    const file = fileInput.files[0];
    formData.append("image", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/recognize-player", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error recognizing player.");
        return;
      }

      const responseData = await response.json();
      const playerName = responseData.player_name;
      const statistics = responseData.statistics;

      setPlayerName(playerName);
      setStatistics(statistics);

      // Fetch images from the `/test` endpoint after recognizing the player
      const imagesResponse = await fetch(
        `http://127.0.0.1:5000/test?player_name=${playerName}`
      );
      const imagesData = await imagesResponse.json();
      setImages(imagesData.images || []);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while recognizing the player.");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-8">
            Player Recognition Dashboard
          </h1>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upload Player Image</CardTitle>
                <CardDescription>
                  Upload an image to recognize the player and fetch their
                  statistics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Uploaded player"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] bg-muted flex items-center justify-center rounded-lg">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="image/*"
                    id="player-image"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("player-image").click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" /> Select Image
                  </Button>
                  <Button type="button" onClick={handleRecognizePlayer}>
                    Recognize Player
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Player Statistics Card */}
            <Card className={"mt-8"}>
              <CardHeader>
                <CardTitle>{playerName || ("Player Statistics")}</CardTitle>
                <CardDescription>
                  Player's statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 overflow-auto">
                {playerName ? (
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center w-1/3">
                          Category
                        </TableHead>
                        <TableHead className="text-center w-1/3">
                          Format
                        </TableHead>
                        <TableHead className="text-center w-1/3">
                          Statistic
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-auto">
                      {Object.entries(statistics).map(([category, formats]) =>
                        Object.entries(formats).map(([format, stats]) => (
                          <TableRow key={`${category}-${format}`}>
                            <TableCell className="text-center font-bold">
                              {category}
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {format}
                            </TableCell>
                            <TableCell className="text-center">
                              {typeof stats === "object" && stats !== null ? (
                                <div className="space-y-2 text-left pl-48">
                                  {Object.entries(stats)
                                    .filter(
                                      ([key]) =>
                                        key !== "Player" && key !== "Index"
                                    )
                                    .map(([key, value]) => (
                                      <div key={key} className="flex gap-2">
                                        <span className="font-semibold min-w-[50px]">
                                          {key}:
                                        </span>
                                        <span>{value}</span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <span>No stats found for this Format</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Upload and recognize a player to view their statistics.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Player Images Card */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Player Images</CardTitle>
                <CardDescription>
                  Recent images of {playerName || "the player"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-wrap justify-evenly">
                {images.length > 0 ? (
                  images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${playerName || "Player"} image ${index + 1}`}
                      // width={100}
                      // height={100}
                      className="object-cover m-5"
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    Upload and recognize a player to view their images.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
