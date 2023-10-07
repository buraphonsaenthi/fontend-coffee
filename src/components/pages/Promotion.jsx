import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import StorefrontIcon from '@mui/icons-material/Storefront';

function Album() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullImageOpen, setIsFullImageOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [promotionsResponse, entrepreneursResponse] = await Promise.all([
        axios.get("https://strange-cow-getup.cyclic.app/promotions"),
        axios.get("https://strange-cow-getup.cyclic.app/entrepreneurs"),
      ]);

      const entMap = {};
      const proMap = {};
      const mapMap = {};
      const detMap = {};

      entrepreneursResponse.data.forEach((entrepreneur) => {
        entMap[entrepreneur.id] = entrepreneur.shopname;
        proMap[entrepreneur.id] = entrepreneur.province;
        mapMap[entrepreneur.id] = entrepreneur.location;
        detMap[entrepreneur.id] = entrepreneur.detail;
      });

      setData({
        promotions: promotionsResponse.data,
        ents: entMap,
        provinces: proMap,
        location: mapMap,
        detail: detMap,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewClick = (image) => {
    setSelectedImage(image);
    setIsFullImageOpen(true);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <AppBar position="relative" style={{ backgroundColor: 'rgb(139, 69, 19)' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>          
          <Typography variant="h6" color="inherit" noWrap>
          <StorefrontIcon sx={{ mr: 1 }} />
            HOME
          </Typography></div>
        <div> 
            <Button color="inherit">
              <Link href="/Login" style={{ color: "#fff" }}>
                Sign In
              </Link>
            </Button>
            <Button color="inherit">
              <Link href="/Register" style={{ color: "#fff" }}>
                Register
              </Link>
            </Button></div>          
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Grid container spacing={4}>
            {data &&
              data.promotions
                .filter((promotion) =>
                  selectedProvince
                    ? promotion.province === selectedProvince
                    : true
                )
                .map((promotion) => (
                  <Grid item key={promotion.pro_id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          pt: "100%",
                          position: "relative",
                        }}
                      >
                        <img
                          src={`data:image/jpeg;base64,${promotion.img}`}
                          alt={`Promotion ${promotion.pro_id}`}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </CardMedia>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <>
                          <Typography gutterBottom variant="h5" component="h2">
                            Shop Name: {data.ents?.[promotion.ent_id]}
                          </Typography>
                          <Typography gutterBottom variant="h5" component="h2">
                            Province: {data.provinces?.[promotion.ent_id]}
                          </Typography>
                          <Typography>
                            {data.detail?.[promotion.ent_id]}
                          </Typography>
                          <Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                const mapUrl =
                                  data.location?.[promotion.ent_id];
                                if (mapUrl) {
                                  window.open(mapUrl, "_blank");
                                } else {
                                  alert("ไม่มีข้อมูลแผนที่");
                                }
                              }}
                            >
                              ดูแผนที่
                            </Button>
                          </Typography>
                        </>
                      </CardContent>

                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => handleViewClick(promotion.img)}
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </main>
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Coffee On Broad ©
        </Typography>
      </Box>

      <Dialog open={isFullImageOpen} onClose={() => setIsFullImageOpen(false)}>
        <DialogContent>
          <img
            src={`data:image/jpeg;base64,${selectedImage}`}
            alt="Full Promotion"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFullImageOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default Album;
