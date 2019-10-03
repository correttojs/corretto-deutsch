import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { FormClose } from 'grommet-icons';

export const Alert = ({show, message}: any) => {
    const [timeExpired, setTimeExpired] = useState(false)
    useEffect(()=>{
        let cancel: number = 0;
        if(show){
            setTimeExpired(false)
            cancel = setTimeout(() => {
                setTimeExpired(true)
            }, 2000)
            
        }
        return () => {
            clearTimeout(cancel)
        }
    }, [show])
   
    if(!show || timeExpired){
        return null;
    }

    return <Box
        direction="row"
        border={{ color: 'status-error', size: 'large' }}
        margin='medium'
      > <Text alignSelf={'center'}>{message}</Text> <Button icon={<FormClose/>} onClick={() => setTimeExpired(true)} ></Button></Box>
}