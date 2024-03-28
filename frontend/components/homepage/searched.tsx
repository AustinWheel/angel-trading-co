import { useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { searchCollectibles, SearchData, Listing } from '../../api/search';
import { useQuery } from '@tanstack/react-query';
import Price from '../search/price';
import { Grid } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CircularProgress from '@mui/material/CircularProgress';


const Searched = () => {
    const location = useLocation();
    const searched = location.state.searchTerm;
    const { getToken } = useAuth();

    const { data, isError, isLoading} = useQuery<SearchData>({
        queryKey: ['search', searched],
        queryFn: async () => {
            const token = await getToken();
            const resp = await searchCollectibles(searched, token);
            return resp!.data;
        },
    });

    return (
        <div>
            <p>Showing results for "{searched ? searched : "All"}"</p>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: '10px',
                }}
            >
            { !isLoading && !isError && data? 
                data?.listings.map((listing: Listing) => (
                    <div
                        className="m-1 p-1 bg-yellow-200 hover:scale-105 ease-in-out duration-300
                        flex"
                        key={listing.id}
                        style={{
                            width: '200px',
                            borderRadius: '10px',
                        }}
                    >   
                        <Grid container>
                            <Grid xs={12}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        height: '200px',
                                        width: '190px',
                                        padding: 5
                                    }}
                                    >
                                    <img src={ data?.listings[0].images.split("', ")[0].split("['")[1] } alt={listing.collectible.name} 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                    }} />
                                </div>
                            </Grid>
                            <Grid xs={3} style={{ display: 'flex', justifyContent: 'center' }} />
                            <Grid xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} >
                                <div className='flex pr-1'>$<Price data={listing.price} /></div>
                                <VerifiedIcon color="success" fontSize='large'/>
                            </Grid>
                            <Grid xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} >
                                <div className='flex'>{listing.collectible.series.split("-")[0].toUpperCase()[0] + listing.collectible.series.split("-")[0].substring(1) + " " + listing.collectible.series.split("-")[1].toUpperCase()[0] + listing.collectible.series.split("-")[1].substring(1)}</div>
                            </Grid>
                            <Grid xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} >
                                <div className='flex'>{listing.collectible.name}</div>
                            </Grid>
                        </Grid>
                    </div>
                ))
             : 
             <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90vh',
                    width: '100vw',
             }}>
                 <CircularProgress color="success" size={100}/>
             </div>}
             </div>
        </div>
    );
};

export default Searched;
