// @ts-nocheck
// This is a monstrosity of a file, i apologize for my sins
// beware if you decide to read this file, it is not for the faint of heart

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getCollectibles } from "../../api/collectibles";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { CircularProgress, Input } from '@mui/material';
import { postImgToS3 } from '../../utils/s3utils';
import LinearProgress from '@mui/material/LinearProgress';
import CancelIcon from '@mui/icons-material/Cancel';
import { postTrade } from '../../api/profile';
import {submitForVerificaiton, submitForVerification} from '../../api/verify';
import { Switch } from '@mui/material';

type Collectible = {
    id: string;
    name: string;
    series: string;
    product: string;
    image: string;
};

type Image = {
    imagePreview: string;
    file: string;
};

const NewTrade = () => {
    const [open , setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { getToken } = useAuth();
    const { data , isLoading, isError } = useQuery<readonly Collectible[]>({
        queryKey: ['collectibles'],
        queryFn: async () => {
            const token = await getToken();
            const resp = await getCollectibles(token);
            return resp!.data;
        }
    });

    const getOptions = (data: readonly Collectible[] | undefined) => {
        if (data === undefined) {
            return {};
        }
        const props = {
            options: data,
            getOptionLabel: (option: Collectible) => `${option.series.toUpperCase().charAt(0) + option.series.slice(1)} ${option.name}`,
          };
        return props;
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    
    const [collectible, setCollectible] = React.useState<Collectible | null>(null);
    const [available, setAvailable] = React.useState(false);

    const [description, setDescription] = React.useState<string>('');
    const [price, setPrice] = React.useState(0.0);
    
    const [images, setImages] = React.useState<Image[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [disabled, setDisabled] = React.useState(true);
    const [verifyImage, setVerifyImage] = React.useState<Image>(undefined);
    const [verified, setVerified] = React.useState(undefined);
    const [verifying, setVerifying] = React.useState(false);
    const [status, setStatus] = React.useState("Verify");

    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onloadend = () => {
                setImages([ { imagePreview: reader.result as string, file: file }, ...images ]);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const onVerifyChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onloadend = () => {
                setVerifyImage({ imagePreview: reader.result as string, file: file });
            };
            reader.readAsDataURL(file);
        }
    }

    const onClearVerify = () => {
        setVerifyImage(undefined);
        setVerified(undefined);
        document.getElementById('verifyInput').value = '';
    }


    const onClearImage = (i: Image) => {
        setImages(images.filter((image) => image !== i));
        document.getElementById('input').value = '';
    }
    
    React.useEffect(() => {
        setDisabled(!(collectible !== undefined && description !== '' && images.length !== 0 && verifying !== true && isUploading !== true));
    }, [images, collectible, description, verifying, isUploading]);


    React.useEffect(() => {
        if (verified !== undefined) {
            if (verified) setStatus("Verified!");
            else setStatus("Could not verify!");
        }
        else setStatus("Verify"); 
      }, [verified, verifying])

    const handleCreate = async () => {
        if (disabled) {
            return;
        };
        setIsUploading(true);
        const form = {
            collectible: collectible.id,
            available: available,
            price: price,
            description: description,
            images: [],
            verifyImage: verifyImage !== undefined ? verifyImage.imagePreview : '',
        };
        const token = await getToken();
        for (let i = 0; i < images.length; i++) {
            const imgUrl = await postImgToS3(images[i].file, token);
            images[i].imagePreview = imgUrl;
            form.images.push(imgUrl);
        }

        const resp = await postTrade(token, form);
        if (resp && resp.status === 201) {
            setIsUploading(false);
            setOpen(false);
        } else {
            setIsUploading(false);
        }
    };

    const verify = async () => {
        setVerifying(true);
        const token = await getToken();
        const imgUrl = await postImgToS3(verifyImage.file, token);
        verifyImage.imagePreview = imgUrl;
        const resp = await submitForVerification(token, {image: verifyImage.imagePreview})
        setVerified(resp?.data.verified);
        setVerifying(false);
    }

    return (
        <>
            <div className="fixed bottom-10 right-10" onClick={handleClickOpen}> 
                <div className="flex justify-center items-center text-xl hover:scale-110 h-6 w-50 px-5 py-6 bg-green-350 text-black rounded-lg transition duration-300 ease-in-out hover:bg-green-450 outline outline-green-450 outline-3 hover:cursor-pointer" >
                    New Trade
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleCancel}
                aria-labelledby="responsive-dialog-title"
            >
                    <p className='pt-6 pl-6 text-xl'>
                        Create a new trade!
                    </p>
                <DialogContent>
                    <div className = "flex flex-col">
                        <>
                        { isUploading ? 
                        <div style={{color: "#BBF670"}}>
                            <LinearProgress style={{
                                marginBottom: '10px',
                            }}
                            color="inherit"
                            /> 
                        </div>
                        : 
                        <></>}
                        {
                            !isLoading && !isError ? 
                            (
                                <div>
                                    <Autocomplete
                                        {...getOptions(data)}
                                        value={collectible}
                                        onChange={(_: any, newValue: Collectible | null) => {
                                            setCollectible(newValue);
                                        }}
                                        id="controllable-states-demo"
                                        sx={{ width: "100%", marginBottom: 2, }}
                                        renderInput={(params) => <TextField {...params} color="success" label="Select a Smiski to trade" />}
                                    />
                                    <div style={{width: "100%", marginBottom: 15}}>
                                    Make this collectible available for trading or selling?
                                    <Switch
                                        checked={available}
                                        onChange={() => setAvailable(!available)}
                                        name="Available"
                                        color="success"
                                    />
                                    </div>
                                    <TextField 
                                        type="number" 
                                        min="0.0" 
                                        label='[Optional] Price (if selling)'
                                        style={{ backgroundColor: "#FFF", width: "100%", marginBottom: 15, borderWidth: 1, borderRadius: 5, borderColor: ""}}
                                        value={price}
                                        color="success"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setPrice(event.target.value);
                                        }}
                                    />
                                    <TextField
                                        id="outlined-multiline-static"
                                        placeholder='Trade Description'
                                        value={description}
                                        onChange={(event: any) => {
                                            setDescription(event.target.value);
                                        }}
                                        multiline
                                        rows={4}
                                        color="success"
                                        style={{
                                            width: "100%",
                                            marginBottom: 15,
                                        }}
                                    />
                                    <label htmlFor="input" >
                                        <div className="hover:cursor-pointer flex justify-center items-center text-md hover:scale-101 w-50 px-2 py-1 bg-green-350 text-black rounded-lg transition duration-300 ease-in-out hover:bg-green-450 outline outline-green-450 outline-3">
                                            Add an image
                                        </div>
                                    </label>
                                    <input
                                        accept="image/*"
                                        onChange={onImageChange}
                                        id="input"
                                        type="file"
                                        style={{
                                            opacity: 0,
                                            position: "absolute",
                                            zIndex: -1
                                        }}
                                    />
                                    {
                                        images.length > 0 ? (
                                            <div style={{display: 'flex', width: 150*images.length}}>
                                                {images.map((i: Image) => 
                                                    <div
                                                    className=" mr-1 mt-2 hover:scale-101 ease-in-out duration-300
                                                    flex items-center justify-end"
                                                    key={i.imagePreview}
                                                >
                                                    <CancelIcon className='relative z-10' fontSize="medium" onClick={() => onClearImage(i)} 
                                                    style={{
                                                        top: "40%",
                                                        left: "95%",
                                                        zIndex: 1,
                                                        cursor: 'pointer',
                                                    }}
                                                    />
                                                    <img src={ i.imagePreview } alt={i.imagePreview} style={{height: '100%', zIndex: 0, borderRadius: 10}} />
                                                </div>
                                                )}
                                            </div>
                                        ) : (<></>)
                                    }
                                    <div className="mt-5" style={{display: 'flex', flexDirection: "row",}}>
                                        <div style={{flex: 0.5-0.025}}>
                                            Please submit a photo of the bottom of your smiski containing the SMISKI copyright. An example is provided below. Verification is optional but recommended.
                                            <div
                                                className="pt-2 hover:scale-101 ease-in-out duration-300
                                                grid items-center justify-end"
                                            >
                                                <img src="https://angel-trading-direct-upload.s3.us-east-2.amazonaws.com/imgjpq.jpg" alt={"Example Verification Image"} className="grid-rows-1 grid-cols-1" style={{borderRadius: 10}} />
                                            </div>
                                        </div>
                                        <div style={{flex:0.05}}/>
                                        <div style={{flex: 0.5-0.025}}>
                                        <label htmlFor="verifyInput" >
                                            <div className="hover:cursor-pointer flex justify-center items-center text-md hover:scale-101 w-50 px-2 py-1 bg-green-350 text-black rounded-lg transition duration-300 ease-in-out hover:bg-green-450 outline outline-green-450 outline-3">
                                                Add image to verify
                                            </div>
                                        </label>
                                        <input
                                            accept="image/*"
                                            onChange={onVerifyChange}
                                            id="verifyInput"
                                            type="file"
                                            style={{
                                                opacity: 0,
                                                position: "absolute",
                                                zIndex: -1
                                            }}
                                        />
                                        {verifyImage !== undefined ? (
                                            <div style={{flex:1, zIndex: 10}}>
                                                <div
                                                    className="mt-2 mb-2 hover:scale-101 ease-in-out duration-300
                                                    grid"
                                                >
                                                    <img src={ verifyImage.imagePreview } alt={"Submitted Image"} className="row-start-1 col-start-1" style={{width: '100%', borderRadius: 10}} />
                                                    <CancelIcon className='row-start-1 col-start-1' fontSize="medium" onClick={() => onClearVerify()} 
                                                    style={{
                                                        margin: 5,
                                                        cursor: 'pointer',
                                                    }}
                                                    />
                                                </div>
                                                <div className="hover:cursor-pointer flex justify-center items-center text-md hover:scale-101 w-50 px-2 py-1 bg-green-350 text-black rounded-lg transition duration-300 ease-in-out hover:bg-green-450 outline outline-green-450 outline-3"
                                                    onClick={verify}
                                                >
                                                    {verifying ? 
                                                        <CircularProgress color="success" /> : 
                                                        status
                                                    }
                                                </div>
                                            </div>
                                        ) : (<></>)
                                    }
                                        </div>
                                    </div>
                                </div>
                            ) 
                            : 
                            (<></>)
                        }
                        </>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className="hover:cursor-pointer flex justify-center items-center text-md hover:scale-110 w-50 px-2 py-1 bg-yellow-300 text-black rounded-lg transition duration-300 ease-in-out hover:bg-yellow-500 outline outline-yellow-500 outline-3" 
                        onClick={handleCancel}
                    >
                        Cancel
                    </div>
                    <div className="hover:cursor-pointer flex justify-center items-center text-md hover:scale-110 w-50 px-2 py-1 bg-green-350 text-black rounded-lg transition duration-300 ease-in-out hover:bg-green-450 outline outline-green-450 outline-3" 
                        onClick={handleCreate}
                        style={{
                            opacity: disabled ? 0.5 : 1,
                            pointerEvents: disabled ? 'none' : 'auto',
                            hover: disabled ? 'none' : 'scale-110',                   
                        }}
                    >
                        Create
                    </div>
                </DialogActions>
            </Dialog>
        </>
      );
};

export default NewTrade;