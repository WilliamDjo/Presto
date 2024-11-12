import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRequest } from '../HelperFiles/helper';
import { startSaving, finishSaving } from './saveStatusSlice';
import { getSlides } from '../HelperFiles/helper';

const initialState =  {
  loading: false,
  presentations: null,
  error: ''
};

export const fetchPresentations = createAsyncThunk("presentations/fetchPresentations", async () => {
  console.log("Fetching presentations");
  const res = await fetchRequest('/store', 'get', null, localStorage.getItem('token'), null);
  console.log(res.store);
  return res.store.presentations;
});

export const savePresentations = createAsyncThunk("presentations/savePresentations", async (_, { dispatch, getState }) => {
  const { presentations } = getState().presentations;
  if (presentations === null) {
    console.log("Aborting save");
    return;
  }
  console.log("Saving:", presentations);

  dispatch(startSaving());
  const userStore = {
    store: {
      presentations: presentations
    }
  };

  console.log('saving', userStore);
  await fetchRequest('/store', 'put', userStore, localStorage.getItem('token'), null);

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
        id: Date.now(),
        title: action.payload,
        thumbnail: "Default thumbnail", // TODO: fix thumbnail format
        defaultBackground: "Default background", // TODO: fix background format
        versionHistory: [],
        slides: [
          {
            slideNum: 1,
            background: null,
            contents: []
          }
        ]
      };

      state.presentations = [...state.presentations, newPresentation];
    },
    deletePresentation: (state, action) => {
      const id = action.payload;
      state.presentations = state.presentations.filter(presentation => presentation.id != id);
    },
    addNewSlide: (state) => {
      const slides = getSlides(state.presentations);
      const newSlide = {
        slideNum: slides.length + 1,
        background: null,
        contents: []
      }
      const newSlides = [...slides, newSlide];

      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides = newSlides;
    },
    deleteSlide: (state, action) => {
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides = state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides.filter((_, index) => index !== (action.payload - 1));
      
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides.forEach((slide, index) => slide.slideNum = index + 1);
    },
    addTextElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];

      const textElement = {
        index: slide.contents.length,
        type: "text",
        attributes: action.payload,
        // position: {
        //   x: 0,
        //   y: 0
        // }
        position: action.payload.position
      }
      console.log('position', action.payload.position);
      
      const newSlideContents = [...slide.contents, textElement];

      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents = newSlideContents;
    },
    addImageElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];
      
      const imageElement = {
        index: slide.contents.length,
        type: "image",
        attributes: {
          elementSize: action.payload.elementSize,
          imageSource: action.payload.imageSource,
          altText: action.payload.altText
        },
        position: {
          x: 0.1,  // 10% from left
          y: 0.1   // 10% from top
        }
      };
      
      const newSlideContents = [...slide.contents, imageElement];
      
      state.presentations.find(
        (presentation) => presentation.id == location.pathname.split("/")[2]
      ).slides[parseInt(location.hash.split("/")[1]) - 1].contents = newSlideContents;
    },
    addVideoElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];
      
      const videoElement = {
        index: slide.contents.length,
        type: "video",
        attributes: {
          elementSize: action.payload.elementSize,
          videoSource: action.payload.videoSource,
          altText: action.payload.altText,
          autoplay: action.payload.autoplay,
          muted: action.payload.muted,
          controls: action.payload.controls
        },
        position: {
          x: 0.1,  // 10% from left
          y: 0.1   // 10% from top
        }
      };
      
      const newSlideContents = [...slide.contents, videoElement];
      
      state.presentations.find(
        (presentation) => presentation.id == location.pathname.split("/")[2]
      ).slides[parseInt(location.hash.split("/")[1]) - 1].contents = newSlideContents;
    }
    ,
    updateElementPosition: (state, action) => {
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents[action.payload.index].position = action.payload.position;
    },
    updateElementSize: (state, action) => {
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents[action.payload.index].attributes.elementSize = action.payload.size;
    },
    updateSlide: (state, action) => {
      console.log("updateSlide", state, action);
      // state.value = action.payload;
    },
    updatePresentationTitle: (state, action) => {
      const { id, title } = action.payload;
      const presentation = state.presentations.find(p => p.id == id);
      if (presentation) {
        presentation.title = title;
      }
    },
    
    updatePresentationThumbnail: (state, action) => {
      const { id, thumbnail } = action.payload;
      const presentation = state.presentations.find(p => p.id == id);
      if (presentation) {
        presentation.thumbnail = thumbnail;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPresentations.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(fetchPresentations.fulfilled, (state, action) => {
      state.loading = false;
      state.presentations = action.payload;
      state.error = '';
    })
    builder.addCase(fetchPresentations.rejected, (state, action) => {
      state.loading = false;
      state.presentations = [];
      state.error = action.error.message;
    })

    builder.addCase(savePresentations.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(savePresentations.fulfilled, (state) => {
      state.loading = false;
      state.error = '';
    })
    builder.addCase(savePresentations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});

export const { addNewSlide, deleteSlide, updateSlide, setPresentations, createNewPresentation, deletePresentation, updatePresentationTitle, updatePresentationThumbnail , addTextElement, addImageElement, addVideoElement, updateElementPosition, updateElementSize } = presentationsSlice.actions;
export default presentationsSlice.reducer;
