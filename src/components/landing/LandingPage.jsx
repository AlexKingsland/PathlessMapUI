import React from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import Car from "../../assets/Car.png";
import Cheeta from "../../assets/Cheeta.png";
import Nepal from "../../assets/Nepal Hike.png";
import Party from "../../assets/Party.png";
import Snorkle from "../../assets/Snorkle.png";
import GlobeGif from "../../assets/Globe.gif";
import Explorer from "../../assets/Explorer.png";
import Creator from "../../assets/Creator.png";

const SectionOne = () => (
  <Box sx={{ padding: 4, backgroundColor: "#D3A484"}}>
    {/* Main Landing Content */}
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ maxWidth: "60%" }}>
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          The First Travel App <br /> For Every Niche
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2,fontSize: "24px" }}>
          All routes are crafted by our diverse community of map makers, individuals from all walks of life who are passionate to share their unique experiences and hidden gems with you.
        </Typography>
        
      </Box>
      <Box
        component="img"
        src={GlobeGif} // Replace with the path to your globe image
        alt="Globe"
        sx={{ width: "100%", maxWidth: 700, objectFit: "contain" }}
      />
    </Box>
    <Grid container spacing={2} sx={{ marginTop: 4 }}>
        {[Car, Cheeta, Nepal, Party, Snorkle].map((src, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <Box
            component="img"
            src={src} // Replace with actual image paths
            alt={`Travel image ${index + 1}`}
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        </Grid>
      ))}
    </Grid>
   
  </Box>
);


const SectionTwo = () => (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#D3A484", // Light background color for the top and bottom areas
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Top Section Title */}
      <Typography variant="h3" sx={{ fontWeight: "bold", color: "#2B2B2B", marginBottom: 3 }}>
        Become a Founding Member
      </Typography>
  
      {/* Full-width Dark Background Section */}
      <Box
        sx={{
          width: "80%", // Full-width for the dark background
          backgroundColor: "#844021", // Dark brown background color
          paddingY: 4, // Vertical padding for spacing inside the section
          borderRadius: "16px"
        }}
      >
        {/* Centered Content Box */}
        <Box
          sx={{
            maxWidth: "1200px", // Limits the content width to keep it centered
            marginX: "auto",
            paddingX: 4,
          }}
        >
          <Grid container spacing={4}>
            {/* Left Section - Why We Need You */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF" }}>
                Be Part of the Adventure <span role="img" aria-label="arrow">➡️</span>
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1, color: "#FFF", fontSize: "18px" }}>
                Join us as a Founding Member and help shape the future of travel. By signing up, you’ll get exclusive access to our initial 
                routes and early features, tailored for passionate explorers like you. Your feedback will directly impact the app’s development, 
                allowing us to create the most user-friendly experience possible. <br /><br />As a Founding Member, you’ll be the first to try our curated, 
                off-the-beaten-path routes and share your thoughts on what works best. Plus, enjoy insider perks, sneak peeks, and the chance to 
                be a key part of our growing community. Sign up today and be a pioneer in discovering or sharing the world.
              </Typography>
            </Grid>
  
            {/* Right Section - Join Form with Light Background */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: "#E5C6A4", // Light brown background for the form container
                  padding: 4,
                  borderRadius: "10px",
                  border: "2px solid #2B2B2B",
                  maxWidth: 400,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2B2B2B" }}>
                  Join Our Community
                </Typography>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  sx={{
                    marginTop: 2,
                    backgroundColor: "white",
                    border: "1px solid #2B2B2B",
                    borderRadius: "10px",
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  sx={{
                    marginTop: 2,
                    backgroundColor: "white",
                    border: "1px solid #2B2B2B",
                    borderRadius: "10px",
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  sx={{ marginTop: 2, fontWeight: "bold" }}
                >
                  Join
                </Button>
                <Typography variant="caption" sx={{ display: "block", marginTop: 1, color: "#2B2B2B" }}>
                  We’ll never share your email with anyone else.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {/* Bottom Announcement Text */}
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#FFF",
            marginTop: 4,
          }}
        >
          We Are Launching Soon And Need Your Support!
        </Typography>
        </Box>
      </Box>
    </Box>
  );

  const SectionThree = () => (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#D3A484", // Adjust background color as needed
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          fontSize: "44px",
          color: "#6A3A2B", // Adjust color as needed
          marginBottom: 3,
        }}
      >
        FIND YOUR PATH
      </Typography>
  
      <Grid container spacing={4} justifyContent="center">
        {/* Explorer Image */}
        <Grid item xs={12} sm={6} md={4}sx={{ marginX: 2 }}>
          <Box
            component="img"
            src={Explorer}
            alt="Explorer"
            sx={{
              width: "100%",
              borderRadius: "16px", // Add rounded corners
              backgroundColor: "#8B5A45", // Background color for the card
              padding: 2, // Padding inside the card
            }}
          />
        </Grid>
  
        {/* Creator Image */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            component="img"
            src={Creator}
            alt="Creator"
            sx={{
              width: "100%",
              borderRadius: "16px", // Add rounded corners
              backgroundColor: "#8B5A45", // Background color for the card
              padding: 2, // Padding inside the card
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );




const LandingPage = () => {
  return (
    <Box>
      <SectionOne /> {/* Main landing section */}
      <SectionTwo /> {/* Section "Two" */}
      <SectionThree /> {/* Section "Three" */}
    </Box>
  );
};

export default LandingPage;