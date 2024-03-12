import logo from "./logo.svg";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "@mui/material";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(8);
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const interval = setTimeout(() => {
      loadData();
    }, 3000);
  }, []);

  const loadData = async () => {
    const pokemonData = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=8`
    );
    const response = await pokemonData.json();

    const pokemonDetails = response.results.map(async (pokemon) => {
      const responsePokemon = await fetch(pokemon.url);
      const details = await responsePokemon.json();
      return {
        name: details.name,
        img: details.sprites.front_default,
        url: pokemon.url,
      };
    });

    const detailsPromise = await Promise.all(pokemonDetails);

    console.log("pokemo detail", detailsPromise);

    if (detailsPromise.length > 0) {
      //setData([...response.results]);

      setData((previousValue) => {
        setHistoricalData([...previousValue, ...detailsPromise]);
        return [...detailsPromise];
      });
    }

    setLoading(false);
  };

  const CardPokemon = (data) => {
    console.log("data", data.data.img);

    const name = data.data.name.toUpperCase();
    const link = data.data.url;
    const pokemonImage = data.data.img;
    return (
      <>
        <Grid xs={6}>
          <Card variant="outlined" sx={{ margin: "1rem" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Your Pokemon
              </Typography>

              <img
                src={pokemonImage}
                style={{ maxWidth: `100%`, height: `auto` }}
              />

              <Typography variant="h5" component="div">
                {name}
              </Typography>

              <Typography variant="body2"></Typography>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link href={link} target="_blank">
                  Learn More
                </Link>
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </>
    );
  };

  return (
    <div className="App">
      <div className="container">
        {loading ? (
          <div>...loading</div>
        ) : (
          <>
            <div>
              <ul>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  {data.map((item, index) => (
                    <CardPokemon key={index} data={item} />
                    //  <li key={`${item.name}${index}`}>
                    //  {cardPokemon
                    //    {item.name} </li>
                  ))}
                </Grid>
              </ul>
            </div>
            <div>
              <Button
                onClick={() => {
                  const offss = offset + 8;
                  setOffset(offss);
                  loadData();
                }}
                size="small"
              >
                Load more
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
