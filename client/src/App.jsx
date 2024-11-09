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
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "./components/ui/sidebar.jsx";
import { Upload, User, Home, BarChart, Settings, LogOut } from "lucide-react";

export default function DashboardPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [playerName, setPlayerName] = useState("null");
  const [statistics, setStatistics] = useState({
    Batting: {
      ODI: {
        0: 5,
        50: 20,
        100: 3,
        Ave: "40.63",
        BF: 2855,
        HS: "102*",
        Index: 26,
        Inns: 81,
        Mat: 95,
        NO: 15,
        Player: "ben_stokes",
        Runs: 2682,
        SR: "93.94",
        Span: "2011-2019",
      },
      T20: {
        0: 1,
        50: 0,
        100: 0,
        "4s": 20,
        "6s": 9,
        Ave: "15.46",
        BF: 178,
        HS: "38",
        Index: 38,
        Inns: 20,
        Mat: 23,
        NO: 5,
        Player: "ben_stokes",
        Runs: 232,
        SR: "130.33",
        Span: "2011-2018",
      },
      Test: {
        0: 12,
        50: 20,
        100: 8,
        Ave: "35.72",
        HS: "258",
        Index: 45,
        Inns: 110,
        Mat: 60,
        NO: 4,
        Player: "ben_stokes",
        Runs: 3787,
        Span: "2013-2019",
      },
    },
    Bowling: {
      ODI: {
        4: 1,
        5: 1,
        Ave: "41.71",
        BBI: "5/61",
        Balls: 2912,
        Econ: 6.01,
        Index: 30,
        Inns: 80,
        Mat: 95,
        Player: "ben_stokes",
        Runs: 2920,
        SR: "41.6",
        Span: "2011-2019",
        Wkts: 70,
      },
      T20: {
        4: 0,
        5: 0,
        Ave: "49.6",
        BBI: "3/26",
        Econ: 8.91,
        Index: 1,
        Inns: 18,
        Mat: 23,
        Mdns: 1,
        Overs: 55.4,
        Player: "ben_stokes",
        Runs: 496,
        SR: "33.4",
        Span: "2011-2018",
        Wkts: 10,
      },
      Test: "0",
    },
  }); // For storing player statistics

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPlayerName(null);
        // Reset player name when a new image is uploaded
        setStatistics({
          Batting: {
            ODI: {
              0: 5,
              50: 20,
              100: 3,
              Ave: "40.63",
              BF: 2855,
              HS: "102*",
              Index: 26,
              Inns: 81,
              Mat: 95,
              NO: 15,
              Player: "ben_stokes",
              Runs: 2682,
              SR: "93.94",
              Span: "2011-2019",
            },
            T20: {
              0: 1,
              50: 0,
              100: 0,
              "4s": 20,
              "6s": 9,
              Ave: "15.46",
              BF: 178,
              HS: "38",
              Index: 38,
              Inns: 20,
              Mat: 23,
              NO: 5,
              Player: "ben_stokes",
              Runs: 232,
              SR: "130.33",
              Span: "2011-2018",
            },
            Test: {
              0: 12,
              50: 20,
              100: 8,
              Ave: "35.72",
              HS: "258",
              Index: 45,
              Inns: 110,
              Mat: 60,
              NO: 4,
              Player: "ben_stokes",
              Runs: 3787,
              Span: "2013-2019",
            },
          },
          Bowling: {
            ODI: {
              4: 1,
              5: 1,
              Ave: "41.71",
              BBI: "5/61",
              Balls: 2912,
              Econ: 6.01,
              Index: 30,
              Inns: 80,
              Mat: 95,
              Player: "ben_stokes",
              Runs: 2920,
              SR: "41.6",
              Span: "2011-2019",
              Wkts: 70,
            },
            T20: {
              4: 0,
              5: 0,
              Ave: "49.6",
              BBI: "3/26",
              Econ: 8.91,
              Index: 1,
              Inns: 18,
              Mat: 23,
              Mdns: 1,
              Overs: 55.4,
              Player: "ben_stokes",
              Runs: 496,
              SR: "33.4",
              Span: "2011-2018",
              Wkts: 10,
            },
            Test: "0",
          },
        });
        // Reset statistics when a new image is uploaded
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
    const fileInput = document.getElementById("player-image"); // Get the file input element
    const file = fileInput.files[0]; // Get the uploaded file from the input
    formData.append("image", file);

    try {
      // Make the API call to FastAPI
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
      console.log(responseData);
      const playerName = responseData.player_name;
      const statistics = responseData.statistics;

      setPlayerName(playerName);
      setStatistics(statistics);
      console.log(statistics);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while recognizing the player.");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-6 py-4">
              <img src="/placeholder.svg" alt="Logo" width={32} height={32} />{" "}
              {/* Logo */}
              <span className="text-xl font-bold">Play-ID-vision</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-2 px-4">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Statistics
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-8">
            Player Recognition Dashboard
          </h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Upload Card */}
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
            {/* <Card>
              <CardHeader>
                <CardTitle>{playerName || "Player Statistics"}</CardTitle>
                <CardDescription>
                  View the recognized player's statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 overflow-auto">
                {playerName ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Statistic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className={"overflow-auto"}>
                      {Object.entries(statistics).map(([category, formats]) =>
                        Object.entries(formats).map(([format, stats]) => (
                          <TableRow key={`${category}-${format}`}>
                            <TableCell>{category}</TableCell>
                            <TableCell>{format}</TableCell>
                            <TableCell>{JSON.stringify(stats)}</TableCell>
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
            </Card> */}
            <Card>
              <CardHeader>
                <CardTitle>{playerName || "Player Statistics"}</CardTitle>
                <CardDescription>
                  View the recognized player's statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 overflow-auto">
                {playerName ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Statistic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className={"overflow-auto"}>
                      {Object.entries(statistics).map(([category, formats]) =>
                        Object.entries(formats).map(([format, stats]) => (
                          <TableRow key={`${category}-${format}`}>
                            <TableCell>{category}</TableCell>
                            <TableCell>{format}</TableCell>
                            <TableCell>
                              {/* Check if the stats are an object and format it properly */}
                              {typeof stats === "object" && stats !== null ? (
                                <div className="space-y-2">
                                  {Object.entries(stats).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex justify-between"
                                    >
                                      <span className="font-semibold">
                                        {key}:
                                      </span>
                                      <span>{value}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span>{stats}</span>
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
