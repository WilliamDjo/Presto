{
    presentations: [
        {
            id: string,
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
                    background: null || string,
                    contains: [

                    ]
                },
                {
                    slideNum: int,
                    background: null || string,
                    contains: [
                        {
                            type: 'text',
                            attributes: {
                                elementSize: {
                                    x: int,
                                    y, int
                                },
                                textContent: string,
                                fontSize: float,
                                textColor: string,
                                fontFamily: string
                            },
                            position: {
                                x: int,
                                y: int
                            },
                            layer: int
                        },
                        {
                            type: 'image',
                            attributes: {
                                elementSize: {
                                    x: int,
                                    y, int
                                },
                                imageURL: string,
                                altText: string,
                            },
                            position: {
                                x: int,
                                y: int
                            },
                            layer: int
                        },
                        {
                            type: 'video',
                            attributes: {
                                elementSize: {
                                    x: int,
                                    y, int
                                },
                                videoURL: string,
                                autoPlay: bool,
                            },
                            position: {
                                x: int,
                                y: int
                            },
                            layer: int
                        },
                        {
                            type: 'code',
                            attributes: {
                                elementSize: {
                                    x: int,
                                    y, int
                                },
                                textContent: string,
                                fontSize: float
                            },
                            position: {
                                x: int,
                                y: int
                            },
                            layer: int
                        }
                    ]
                }
            ]
        }
    ]
}