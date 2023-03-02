import React from 'react';

import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

import { placeFilter } from '../redux/slices/filter';
import { SideBlock } from './SideBlock';
import { useDispatch } from 'react-redux';

export const TagsBlock = ({ items, isLoading, parent, setFilterTagvalue, setTabsValue }) => {
  // debugger;
  const dispatch = useDispatch();
  const setTagName = (tagName) => {
    setFilterTagvalue(tagName);
    dispatch(placeFilter(tagName));
  };
  return (
    <SideBlock title="Tags">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <Link
            key={parent + i}
            onClick={() => {
              setTagName(name);
              setTabsValue(null);
            }}
            style={{ textDecoration: 'none', color: 'black' }}
            to={`/tags/${name}`}
          >
            <ListItem key={parent + i} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? <Skeleton key={parent + i} width={100} /> : <ListItemText primary={name} />}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
