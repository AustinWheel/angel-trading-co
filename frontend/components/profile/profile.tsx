import { UserButton } from "@clerk/clerk-react"
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../../api/profile";
import { useAuth } from "@clerk/clerk-react";




type ProfileData = {
    bio: string,
    username: string,
    profile_img: string,
    rating: number,
    raters: number,
    collection: any,
    wishlist: any,
    trades: any 
}

const Profile = () => { 
    const { getToken } = useAuth();

    const { data, isLoading, isError } = useQuery<ProfileData>({
        queryKey: ['profile'],
        queryFn: async () => {
            const token = await getToken();
            const resp = await getProfile(token);
            return resp!.data;
        } 
    });

    const getStars = (rate: number) => {
        let rating = rate;
        const stars = [];
        

        for (let i = 0; i < 5; i++) {
            if (rating >= 1) {
                stars.push(<StarIcon/>)
                rating--;
            } else if (rating > 0) {
                stars.push(<StarHalfIcon/>)
                rating = 0;
            }
            else {
                stars.push(<StarBorderIcon/>)
            }
        }
        return stars;
    }

    return (
        <Box sx={{ flexGrow: 1}} className = "bg-green-100 w-screen">
            
            { !isLoading && !isError && data ? (
                <>
                     <Box sx={{ flexGrow: 1}} >
                        <Grid container spacing={2}>
                            <Grid xs = {2.5}>
                                <button className={`bg-[url('${data.profile_img}')] rounded-full mt-4 ml-4`} style={{ width: '18vw', height: '18vw' }}>
                                </button>
                            </Grid>
                            <Grid xs={7}>
                                <Box sx={{ flexGrow: 1}}>
                                <Grid xs ={12}> 
                                    <p className='text-3xl text-black mt-6'>{data.username}</p>
                                </Grid>
                                <Grid xs={12} className = 'flex items-center'>
                                    {getStars(data.rating)} <p className = 'ml-2 inline text-xs text-black'> ({data.raters})</p>
                                </Grid>
                                <Grid container spacing={0}>
                                    <Grid xs={4} className = 'flex '>
                                        <p className='text-l text-black truncate'>{data.bio}</p>

                                    </Grid>
                                    <Grid xs={8}>
                                        <p className='ml-2 inline text-l text-green-600 hover:text-red-500'>Edit bio</p>

                                    </Grid>
                                </Grid>
                                </Box>
                            </Grid>
                                
                                
                            <Grid xs = {2.5}>
                                <p className='text-s text-black mt-6'> Date Joined: API Call</p>
                            </Grid>
                            


                        </Grid>
                    </Box>
                    
                    
                </>
                ) 
                : 
                (<></>)}
        </Box>
            
    );
};

export default Profile;
