// Buttons that put songs from the library into the disc list.

import React from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Add as AddIcon } from '@mui/icons-material';
import { Check as CheckIcon } from '@mui/icons-material';

import { addTracks, inDiscList, useDiscList } from '../../disc-list/store';
import { Track } from '../../jellyfin/library';

/** A small + at the end of a song's row; a tick once the song is in the disc list. */
export const AddTrackButton = ({ track }: { track: Track }) => {
    const list = useDiscList();
    const added = inDiscList(track.Id, list);
    return (
        <Tooltip title={added ? 'In the disc list' : 'Add to the disc list'} placement="left">
            <span>
                <IconButton
                    size="small"
                    disabled={added}
                    aria-label={added ? `${track.Name} is in the disc list` : `Add ${track.Name} to the disc list`}
                    onClick={() => addTracks([track])}
                >
                    {added ? <CheckIcon fontSize="small" color="primary" /> : <AddIcon fontSize="small" />}
                </IconButton>
            </span>
        </Tooltip>
    );
};

/** Adds every song of an album or playlist that isn't in the disc list yet. */
export const AddAllButton = ({ tracks, label }: { tracks: Track[] | null; label: string }) => {
    const list = useDiscList();
    const allAdded = !!tracks && tracks.length > 0 && tracks.every((track) => inDiscList(track.Id, list));
    return (
        <Button
            variant="contained"
            startIcon={allAdded ? <CheckIcon /> : <AddIcon />}
            disabled={!tracks || tracks.length === 0 || allAdded}
            onClick={() => tracks && addTracks(tracks)}
        >
            {allAdded ? 'In the disc list' : label}
        </Button>
    );
};
