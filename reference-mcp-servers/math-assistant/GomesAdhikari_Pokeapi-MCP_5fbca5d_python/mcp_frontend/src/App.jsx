import { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, TextField, Button, CircularProgress, Alert, Grid, Divider, Chip, Avatar, Stack, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import '@fontsource/fredoka-one';

const API_BASE = "http://127.0.0.1:8000/api/agent" // Adjust if your backend is on a different port or path

function App() {
  // --- Pokémon Search State ---
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // --- Compare Pokémon State ---
  const [compare1, setCompare1] = useState('');
  const [compare2, setCompare2] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState('');

  // --- Suggest Counters State ---
  const [counterName, setCounterName] = useState('');
  const [counterResult, setCounterResult] = useState(null);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterError, setCounterError] = useState('');

  // --- Generate Team State ---
  const [teamDesc, setTeamDesc] = useState('');
  const [teamResult, setTeamResult] = useState(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState('');

  // --- Handlers ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchError('');
    setSearchResult(null);
    try {
      const res = await fetch(`${API_BASE}/pokemon-info/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: searchName })
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResult(data.result);
      } else {
        setSearchError(data.error || 'Unknown error');
      }
    } catch (err) {
      setSearchError('Network error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setCompareLoading(true);
    setCompareError('');
    setCompareResult(null);
    try {
      const res = await fetch(`${API_BASE}/compare/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemon1: compare1, pokemon2: compare2 })
      });
      const data = await res.json();
      if (res.ok) {
        setCompareResult(data.result);
      } else {
        setCompareError(data.error || 'Unknown error');
      }
    } catch (err) {
      setCompareError('Network error');
    } finally {
      setCompareLoading(false);
    }
  };

  const handleCounter = async (e) => {
    e.preventDefault();
    setCounterLoading(true);
    setCounterError('');
    setCounterResult(null);
    try {
      const res = await fetch(`${API_BASE}/strategy/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: counterName })
      });
      const data = await res.json();
      if (res.ok) {
        setCounterResult(data.result);
      } else {
        setCounterError(data.error || 'Unknown error');
      }
    } catch (err) {
      setCounterError('Network error');
    } finally {
      setCounterLoading(false);
    }
  };

  const handleTeam = async (e) => {
    e.preventDefault();
    setTeamLoading(true);
    setTeamError('');
    setTeamResult(null);
    try {
      const res = await fetch(`${API_BASE}/team/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: teamDesc })
      });
      const data = await res.json();
      if (res.ok) {
        setTeamResult(data.result);
      } else {
        setTeamError(data.error || 'Unknown error');
      }
    } catch (err) {
      setTeamError('Network error');
    } finally {
      setTeamLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #ffcb05 0%, #3b4cca 100%)',
      border: '4px solid #e3350d',
      boxSizing: 'border-box',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0,
    }}>
      <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, zIndex: 1 }}>
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(59,76,202,0.18)', background: 'rgba(255,255,255,0.85)', p: { xs: 1, sm: 2, md: 4 }, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Avatar src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png" alt="Pokéball" sx={{ width: 72, height: 72, bgcolor: 'white', border: '3px solid #ffcb05', mr: 2 }} />
            <Typography variant="h3" align="center" gutterBottom fontWeight={900} color="primary" sx={{ textShadow: '2px 2px 0 #ffcb05, 4px 4px 0 #3b4cca' }}>
              Pokémon AI Demo
            </Typography>
          </Box>
          <Typography align="center" color="secondary" gutterBottom sx={{ fontWeight: 700, fontSize: 20, textShadow: '1px 1px 0 #fff' }}>
            Search, compare, counter, and generate teams with the power of AI!
          </Typography>
          <Box sx={{ my: 4, px: 2, py: 2, background: 'rgba(255,255,255,0.85)', borderRadius: 4, boxShadow: '0 2px 12px 0 rgba(59,76,202,0.10)' }}>
            <Grid container spacing={4}>
              {/* Pokémon Search */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Search for Pokémon</Typography>
                    <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
                      <TextField
                        label="Pokémon Name"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                      />
                      <Button type="submit" variant="contained" disabled={searchLoading}>
                        {searchLoading ? <CircularProgress size={24} /> : 'Search'}
                      </Button>
                    </Box>
                    {searchError && <Alert severity="error">{searchError}</Alert>}
                    {searchResult && (
                      <Box sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                          <Avatar src={searchResult.sprite} alt={searchResult.name} sx={{ width: 72, height: 72, bgcolor: 'white', border: '1px solid #eee' }} />
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} textTransform="capitalize">{searchResult.name}</Typography>
                            <Typography variant="body2">ID: {searchResult.id}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              {searchResult.types?.map(type => (
                                <Chip key={type} label={type} color="primary" size="small" />
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                        <Typography variant="body2">Height: {searchResult.height}</Typography>
                        <Typography variant="body2">Weight: {searchResult.weight}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}><b>Flavor:</b> {searchResult.flavor_text}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" fontWeight={600}>Abilities</Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                          {searchResult.abilities?.map(ability => (
                            <Chip key={ability} label={ability} color="secondary" size="small" />
                          ))}
                        </Stack>
                        <Typography variant="subtitle2" fontWeight={600}>Stats</Typography>
                        <Grid container spacing={1} sx={{ mb: 1 }}>
                          {searchResult.stats && Object.entries(searchResult.stats).map(([stat, value]) => (
                            <Grid item xs={6} key={stat}>
                              <Typography variant="body2">{stat.replace('-', ' ')}: <b>{value}</b></Typography>
                            </Grid>
                          ))}
                        </Grid>
                        <Typography variant="subtitle2" fontWeight={600}>Evolution Chain</Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                          {searchResult.evolution_chain?.map(evo => (
                            <Chip key={evo} label={evo} variant="outlined" size="small" />
                          ))}
                        </Stack>
                        <Typography variant="subtitle2" fontWeight={600}>Moves</Typography>
                        <List dense sx={{ maxHeight: 120, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #eee', mb: 1 }}>
                          {searchResult.moves?.map(move => (
                            <ListItem key={move} sx={{ py: 0 }}>
                              <ListItemText primary={move} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Compare Pokémon */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Compare Two Pokémon</Typography>
                    <Box component="form" onSubmit={handleCompare} sx={{ mb: 2 }}>
                      <TextField
                        label="Pokémon 1"
                        value={compare1}
                        onChange={e => setCompare1(e.target.value)}
                        required
                        sx={{ mb: 2, mr: 1 }}
                      />
                      <TextField
                        label="Pokémon 2"
                        value={compare2}
                        onChange={e => setCompare2(e.target.value)}
                        required
                        sx={{ mb: 2, mr: 1 }}
                      />
                      <Button type="submit" variant="contained" disabled={compareLoading}>
                        {compareLoading ? <CircularProgress size={24} /> : 'Compare'}
                      </Button>
                    </Box>
                    {compareError && <Alert severity="error">{compareError}</Alert>}
                    {compareResult && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                          {compareResult.pokemon_1} vs {compareResult.pokemon_2}
                        </Typography>
                        {/* Stat Comparison Table */}
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Stat</TableCell>
                                <TableCell align="center">{compareResult.pokemon_1}</TableCell>
                                <TableCell align="center">{compareResult.pokemon_2}</TableCell>
                                <TableCell align="center">Winner</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(compareResult.stats_comparison).map(([stat, values]) => (
                                <TableRow key={stat}>
                                  <TableCell>{stat.replace('-', ' ')}</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: values.winner === compareResult.pokemon_1 ? 700 : 400, color: values.winner === compareResult.pokemon_1 ? 'success.main' : undefined }}>{values[compareResult.pokemon_1]}</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: values.winner === compareResult.pokemon_2 ? 700 : 400, color: values.winner === compareResult.pokemon_2 ? 'success.main' : undefined }}>{values[compareResult.pokemon_2]}</TableCell>
                                  <TableCell align="center">
                                    <Chip label={values.winner} color="success" size="small" />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* Type Advantage */}
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>Type Advantage</Typography>
                        <Chip label={compareResult.type_advantage} color="info" sx={{ mb: 2, mt: 0.5 }} />
                        {/* Shared Abilities */}
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2 }}>Shared Abilities</Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                          {compareResult.shared_abilities.length > 0 ? compareResult.shared_abilities.map(ability => (
                            <Chip key={ability} label={ability} color="secondary" size="small" />
                          )) : <Typography variant="body2">None</Typography>}
                        </Stack>
                        {/* Unique Abilities */}
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" fontWeight={600}>{compareResult.pokemon_1} Unique Abilities</Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                              {compareResult.unique_abilities[compareResult.pokemon_1].length > 0 ? compareResult.unique_abilities[compareResult.pokemon_1].map(ability => (
                                <Chip key={ability} label={ability} variant="outlined" size="small" />
                              )) : <Typography variant="body2">None</Typography>}
                            </Stack>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" fontWeight={600}>{compareResult.pokemon_2} Unique Abilities</Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                              {compareResult.unique_abilities[compareResult.pokemon_2].length > 0 ? compareResult.unique_abilities[compareResult.pokemon_2].map(ability => (
                                <Chip key={ability} label={ability} variant="outlined" size="small" />
                              )) : <Typography variant="body2">None</Typography>}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Suggest Counters */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Suggest Counters</Typography>
                    <Box component="form" onSubmit={handleCounter} sx={{ mb: 2 }}>
                      <TextField
                        label="Pokémon Name"
                        value={counterName}
                        onChange={e => setCounterName(e.target.value)}
                        required
                        sx={{ mb: 2, mr: 1 }}
                      />
                      <Button type="submit" variant="contained" disabled={counterLoading}>
                        {counterLoading ? <CircularProgress size={24} /> : 'Suggest'}
                      </Button>
                    </Box>
                    {counterError && <Alert severity="error">{counterError}</Alert>}
                    {counterResult && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} textTransform="capitalize">
                          {counterResult.pokemon}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                          {counterResult.types?.map(type => (
                            <Chip key={type} label={type} color="primary" size="small" />
                          ))}
                        </Stack>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>Top Weaknesses</Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                          {counterResult.top_weaknesses && Object.entries(counterResult.top_weaknesses).map(([type, mult]) => (
                            <Chip key={type} label={`${type} ×${mult}`} color="error" size="small" />
                          ))}
                        </Stack>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>Recommended Counters</Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                          {counterResult.recommended_counters?.map(counter => (
                            <Chip key={counter} label={counter} variant="outlined" size="small" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Team Generator */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Generate Team</Typography>
                    <Box component="form" onSubmit={handleTeam} sx={{ mb: 2 }}>
                      <TextField
                        label="Team Description"
                        value={teamDesc}
                        onChange={e => setTeamDesc(e.target.value)}
                        required
                        sx={{ mb: 2, mr: 1 }}
                      />
                      <Button type="submit" variant="contained" disabled={teamLoading}>
                        {teamLoading ? <CircularProgress size={24} /> : 'Generate'}
                      </Button>
                    </Box>
                    {teamError && <Alert severity="error">{teamError}</Alert>}
                    {teamResult && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                          {teamResult.description}
                        </Typography>
                        <Grid container spacing={2}>
                          {teamResult.team?.map((member, idx) => (
                            <Grid item xs={12} sm={6} key={member.name + idx}>
                              <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                <Avatar src={member.image_url} alt={member.name} sx={{ width: 56, height: 56, mr: 2, bgcolor: 'white', border: '1px solid #eee' }} />
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600} textTransform="capitalize">
                                    {member.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {member.role}
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ my: 4, borderColor: 'primary.main', borderWidth: 2 }}>
            <Chip avatar={<Avatar src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeball.png" sx={{ width: 24, height: 24 }} />} label="Gotta catch 'em all!" color="secondary" sx={{ fontWeight: 700, fontSize: 16 }} />
          </Divider>
          <Typography align="center" color="primary" variant="body2" sx={{ fontWeight: 700, letterSpacing: 2, textShadow: '1px 1px 0 #ffcb05' }}>
            &copy; {new Date().getFullYear()} Pokémon AI Demo
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
