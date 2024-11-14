import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRequest, getSlidePositionById } from '../HelperFiles/helper';
import { startSaving, finishSaving } from './saveStatusSlice';
import { getSlides } from '../HelperFiles/helper';

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
        thumbnail: presentation.thumbnail,
        defaultBackground: presentation.defaultBackground,
        slides: [...presentation.slides]
      },
      ...presentation.versionHistory
    ];
    console.log('hi')
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
        title: action.payload,
        thumbnail: null,
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
          title: action.payload,
          thumbnail: null,
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
              background: null,
              contents: []
            }
          ]
        }],
        slides: [
          {
            slideNum: 1,
            id: String(Date.now()),
            background: null,
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
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).defaultBackground = action.payload;
      state.shouldSave = true;
    },
    addNewSlide: (state) => {
      const slides = getSlides(state.presentations);
      const newSlide = {
        slideNum: slides.length + 1,
        id: String(Date.now()),
        background: null,
        contents: []
      }
      const newSlides = [...slides, newSlide];

      state.presentations.find((presentation) => presentation.id === location.pathname.split("/")[2]).slides = newSlides;
      state.shouldSave = true;
    },

    deleteSlide: (state, action) => {
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides = state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides.filter((_, index) => index !== (action.payload - 1));
      
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides.forEach((slide, index) => slide.slideNum = index + 1);
      state.shouldSave = true;
    },
    addTextElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];

      const textElement = {
        index: slide.contents.length,
        type: "text",
        attributes: action.payload,
        position: action.payload.position
      }
      console.log('position', action.payload.position);
      
      const newSlideContents = [...slide.contents, textElement];

      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents = newSlideContents;
      state.shouldSave = true;
    },
    deleteElement: (state, action) => {
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents.splice(action.payload, 1);
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents.forEach((content, index) => content.index = index);
      state.shouldSave = true;
    },
    updateTextElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];
      const elementIndex = action.payload.index;
      
      // Update the element attributes while preserving its position
      slide.contents[elementIndex].attributes = {
        ...slide.contents[elementIndex].attributes,
        ...action.payload.attributes
      };
      state.shouldSave = true;
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
      state.shouldSave = true;
    },
    updateImageElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];
      const elementIndex = action.payload.index;
      
      // Update the element attributes while preserving its position
      slide.contents[elementIndex].attributes = {
        ...slide.contents[elementIndex].attributes,
        ...action.payload.attributes
      };
      state.shouldSave = true;
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
      state.shouldSave = true;
    },
    updateVideoElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];
      const elementIndex = action.payload.index;
      
      // Update the element attributes while preserving its position
      slide.contents[elementIndex].attributes = {
        ...slide.contents[elementIndex].attributes,
        ...action.payload.attributes
      };
      state.shouldSave = true;
    },
    addCodeElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];
      
      const codeElement = {
        index: slide.contents.length,
        type: "code",
        attributes: {
          elementSize: action.payload.elementSize,
          textContent: action.payload.textContent,
          fontSize: action.payload.fontSize,
        },
        position: {
          x: 0.1,  // 10% from left
          y: 0.1   // 10% from top
        }
      };
      
      const newSlideContents = [...slide.contents, codeElement];
      
      state.presentations.find(
        (presentation) => presentation.id == location.pathname.split("/")[2]
      ).slides[parseInt(location.hash.split("/")[1]) - 1].contents = newSlideContents;
      state.shouldSave = true;
    },
    updateCodeElement: (state, action) => {
      const slide = getSlides(state.presentations)[parseInt(location.hash.split("/")[1]) - 1];
      const elementIndex = action.payload.index;
      
      // Update the element attributes while preserving its position
      slide.contents[elementIndex].attributes = {
        ...slide.contents[elementIndex].attributes,
        ...action.payload.attributes
      };
      state.shouldSave = true;
    },
    updateElementPosition: (state, action) => {
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents[action.payload.index].position = action.payload.position;
      state.shouldSave = true;
    },
    updateElementSize: (state, action) => {
      state.presentations.find((presentation) => presentation.id == location.pathname.split("/")[2]).slides[parseInt(location.hash.split("/")[1]) - 1].contents[action.payload.index].attributes.elementSize = action.payload.size;
      state.shouldSave = true;
    },
    updateSlidesBarOrder: (state, action) => {
      const activeIndex = getSlidePositionById(state.presentations, action.payload.active) - 1;
      const overIndex = getSlidePositionById(state.presentations, action.payload.over) - 1;

      const movingSlide = state.presentations.find((presentation) => presentation.id === location.pathname.split("/")[2]).slides.splice(activeIndex, 1)[0];
      state.presentations.find((presentation) => presentation.id === location.pathname.split("/")[2]).slides.splice(overIndex, 0, movingSlide);
      state.presentations.find((presentation) => presentation.id === location.pathname.split("/")[2]).slides.forEach((slide, index) => slide.slideNum = index + 1);
      state.shouldSave = true;
    },
    updatePresentationTitle: (state, action) => {
      const { id, title } = action.payload;
      const presentation = state.presentations.find(p => p.id == id);
      if (presentation) {
        presentation.title = title;
      }
      state.shouldSave = true;
    },
    
    updatePresentationThumbnail: (state, action) => {
      const { id, thumbnail } = action.payload;
      const presentation = state.presentations.find(p => p.id == id);
      if (presentation) {
        presentation.thumbnail = thumbnail;
      }
      state.shouldSave = true;
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
      state.shouldSave = false;
    })
    builder.addCase(savePresentations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});

export const { addNewSlide, deleteSlide, updateSlidesBarOrder, setPresentations, createNewPresentation, addTextElement, updateElementPosition, updateElementSize, deletePresentation, updatePresentationTitle, updatePresentationThumbnail, addImageElement, addVideoElement, addCodeElement, deleteElement, setDefaultBackground, updateTextElement, updateImageElement, updateVideoElement, updateCodeElement } = presentationsSlice.actions;
export default presentationsSlice.reducer;
