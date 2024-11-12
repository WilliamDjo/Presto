{
    presentations: [
        {
            id: int,
            title: string,
            thumbnail: null || string,
            defaultBackground: string,
            versionHistory: [
                {
                    dateTime: dateTime,
                    title: string,
                    thumbnail: null || string,
                    defaultBackground: string,
                    slides: [

                    ]
                }
            ]
            slides: [
                {
                    slideNum: int,
                    id: int,
                    background: null || string,
                    contents: [

                    ]
                },
                {
                    slideNum: int,
                    id: int,
                    background: null || string,
                    contents: [
                        {
                            index: int,
                            type: 'text',
                            attributes: {
                                elementSize: {
                                    x: float,
                                    y: float
                                },
                                textContent: string,
                                fontSize: float,
                                textColor: string,
                                fontFamily: string
                            },
                            position: {
                                x: float,
                                y: float
                            },
                        },
                        {
                            index: int,
                            type: 'image',
                            attributes: {
                                elementSize: {
                                    x: float,
                                    y: float
                                },
                                imageURL: string,
                                altText: string,
                            },
                            position: {
                                x: float,
                                y: float
                            },
                        },
                        {
                            index: int,
                            type: 'video',
                            attributes: {
                                elementSize: {
                                    x: float,
                                    y: float
                                },
                                videoURL: string,
                                autoPlay: bool,
                            },
                            position: {
                                x: float,
                                y: float
                            },
                        },
                        {
                            index: int,
                            type: 'code',
                            attributes: {
                                elementSize: {
                                    x: float,
                                    y: float
                                },
                                textContent: string,
                                fontSize: float
                            },
                            position: {
                                x: float,
                                y: float
                            },
                        }
                    ]
                }
            ]
        }
    ]
}