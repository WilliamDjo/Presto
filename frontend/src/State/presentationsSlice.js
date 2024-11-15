import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRequest, getSlidePositionById } from '../HelperFiles/helper';
import { startSaving, finishSaving } from './saveStatusSlice';
import { getSlides, getCurrentSlideNum, getCurrentPresentationId } from '../HelperFiles/helper';

const initialState =  {
  loading: false,
  presentations: null,
  error: '',
  shouldSave: false
};

export const fetchPresentations = createAsyncThunk("presentations/fetchPresentations", async () => {
  console.log("Fetching presentations");
  const res = await fetchRequest('/store', 'get', null, localStorage.getItem('token'), null);
  console.log(res.store);
  return res.store.presentations;
});

export const savePresentations = createAsyncThunk("presentations/savePresentations", async (presentationId, { dispatch, getState }) => {
  const state = getState().presentations;

  if (state.presentations === null || !state.shouldSave) {
    console.log("Aborting save");
    return;
  }
  dispatch(startSaving());

  const presentations = JSON.parse(JSON.stringify(state.presentations));
  if (presentationId) {
    const presentation = {...presentations.find((presentation) => presentation.id === presentationId)};
    const newVersionHistory = [
      {
        dateTime: Date.now(),
        title: presentation.title,
        description: presentation.description,
        thumbnail: presentation.thumbnail,
        defaultBackground: presentation.defaultBackground,
        slides: [...presentation.slides]
      },
      ...presentation.versionHistory
    ];
    presentations.find((presentation) => presentation.id === presentationId).versionHistory = newVersionHistory;
  }

  const userStore = {
    store: {
      presentations: presentations
    }
  };

  console.log('Saving', userStore);
  await fetchRequest('/store', 'put', userStore, localStorage.getItem('token'), null);
  dispatch(fetchPresentations());

  dispatch(finishSaving());
});

const presentationsSlice = createSlice({
  name: 'presentations',
  initialState,
  reducers: {
    setPresentations: (state, action) => {
      console.log("setPresentations", action.payload);
      state.presentations = action.payload;
    },
    createNewPresentation: (state, action) => {
      const newPresentation = {
        id: String(Date.now()),
        title: action.payload.presentationTitle,
        description: action.payload.presentationDescription,
        thumbnail: action.payload.presentationThumbnail ? action.payload.presentationThumbnail : null,
        defaultBackground: {
          type: "solid",
          attributes: {
            color: "#FFFFFF",
            startingColor: "#FFFFFF",
            endingColor: "#FFFFFF",
            angle: 0,
            imageURL: ""
          }
        },
        versionHistory: [{
          dateTime: Date.now(),
          title: action.payload.presentationTitle,
          description: action.payload.presentationDescription,
          thumbnail: action.payload.presentationThumbnail ? action.payload.presentationThumbnail : null,
          defaultBackground: {
            type: "solid",
            attributes: {
              color: "#FFFFFF",
              startingColor: "#FFFFFF",
              endingColor: "#FFFFFF",
              angle: 0,
              imageURL: ""
            }
          },
          slides: [
            {
              slideNum: 1,
              id: String(Date.now()),
              transition: "none",
              background: {
                type: "none",
                attributes: {
                  color: "#FFFFFF",
                  startingColor: "#FFFFFF",
                  endingColor: "#FFFFFF",
                  angle: 0,
                  imageURL: ""
                }
              },
              contents: []
            }
          ]
        }],
        slides: [
          {
            slideNum: 1,
            id: String(Date.now()),
            transition: "none",
            background: {
              type: "none",
              attributes: {
                color: "#FFFFFF",
                startingColor: "#FFFFFF",
                endingColor: "#FFFFFF",
                angle: 0,
                imageURL: ""
              }
            },
            contents: []
          }
        ]
      };
    
      state.presentations = [...state.presentations, newPresentation];
      state.shouldSave = true;
    },
    deletePresentation: (state, action) => {
      const id = action.payload;
      state.presentations = state.presentations.filter(presentation => presentation.id != id);
      state.shouldSave = true;
    },
    setDefaultBackground: (state, action) => {
      state.presentations.find((presentation) => presentation.id == getCurrentPresentationId()).defaultBackground = action.payload;
      state.shouldSave = true;
    },
    addNewSlide: (state) => {
      const slides = getSlides(state.presentations);
      const newSlide = {
        slideNum: slides.length + 1,
        id: String(Date.now()),
        transition: "none",
        background: {
          type: "none",
          attributes: {
            color: "#FFFFFF",
            startingColor: "#FFFFFF",
            endingColor: "#FFFFFF",
            angle: 0,
            imageURL: ""
          }
        },
        contents: []
      }
      const newSlides = [...slides, newSlide];

      state.presentations.find((presentation) => presentation.id === getCurrentPresentationId()).slides = newSlides;
      state.shouldSave = true;
    },

    deleteSlide: (state, action) => {
      state.presentations.find((presentation) => presentation.id == getCurrentPresentationId()).slides = state.presentations.find((presentation) => presentation.id == getCurrentPresentationId()).slides.filter((_, index) => index !== (action.payload - 1));
      
      state.presentations.find((presentation) => presentation.id == getCurrentPresentationId()).slides.forEach((slide, index) => slide.slideNum = index + 1);
      state.shouldSave = true;
    },
    addTextElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(getCurrentSlideNum()) - 1];

      const textElement = {
        index: slide.contents.length,
        type: "text",
        attributes: action.payload,
        position: action.payload.position
      }
      console.log('position', action.payload.position);
      
      const newSlideContents = [...slide.contents, textElement];

      state.presentations.find((presentation) => presentation.id == getCurrentPresentationId()).slides[parseInt(getCurrentSlideNum()) - 1].contents = newSlideContents;
      state.shouldSave = true;
    },
    deleteElement: (state, action) => {
      state.presentations.find((presentation) => presentation.id == getCurrentPresentationId()).slides[parseInt(getCurrentSlideNum()) - 1].contents.splice(action.payload, 1);
      state.presentations.find((presentation) => presentation.id == getCurrentPresentationId()).slides[parseInt(getCurrentSlideNum()) - 1].contents.forEach((content, index) => content.index = index);
