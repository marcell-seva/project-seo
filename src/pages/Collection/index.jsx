/** @jsxImportSource @emotion/react */
import { Gap } from '../../components/atoms'
import { TopTrending, CarouselCollectionPage, Header, ModalInput, Footer, Error } from '../../components/molecules'
import { styles } from './styles';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import query from '../../config/GraphQl/query';

const Collection = () => {
    const [randomId, setRandomId] = useState(() =>
        Math.floor(Math.random() * 10000)
    )
    const [recommendationAnime, setRecommendationAnime] = useState([])
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [value, setValue] = useState('')
    const [id, setId] = useState(0)
    const [placeholder, setPlaceholder] = useState('')
    const [info, setInfo] = useState('')
    const [isEmpty, setIsEmpty] = useState(true)

    useQuery(query.ANIME_DETAILS, {
        variables: { id: randomId },
        onCompleted: (data) => {
            const result = data.Media
            setRecommendationAnime(result)
            setLoading(false)
        },
        onError: () => {
            const localData = JSON.parse(localStorage.getItem('anime'))
            setRecommendationAnime(localData[8])
            setLoading(false)
        }
    })

    useEffect(() => {
        const result = getCollectionData()
        if (result !== null) {
            setData(result)
            setIsEmpty(false)
        }
    }, [])


    const getCollectionData = () => {
        const result = JSON.parse(localStorage.getItem('anime-collections'))
        return result
    }


    const deleteCollection = (id) => {
        const oldData = JSON.parse(localStorage.getItem('anime-collections'))
        const index = oldData.findIndex(item => id === item.id)
        const updateData = oldData
        updateData.splice(index, 1)
        setData(updateData)
        localStorage.setItem('anime-collections', JSON.stringify(updateData))
    }

    const hadSpecialChar = (payload) => {
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
        return format.test(payload)
    }

    const editCollection = (id) => {
        if (value !== '' && !hadSpecialChar(value)) {
            const oldData = JSON.parse(localStorage.getItem('anime-collections'))
            const index = oldData.findIndex(item => id === item.id)
            const temp = {
                ...oldData[index],
                title: value,
            }
            oldData.splice(index, 1)
            const updateData = [...oldData, ...[temp]]
            localStorage.setItem('anime-collections', JSON.stringify(updateData))
            setData(updateData)
            setIsModalOpen(false)
            setValue('')
        } else {
            setInfo("oops, there's some special character")
        }
    }

    return (
        <div css={styles.body}>
            <div css={styles.main}>
                <Header />
                <div css={styles.container}>
                    {!loading && <TopTrending
                        title={recommendationAnime.title.userPreferred}
                        image={recommendationAnime.bannerImage === null ? recommendationAnime.coverImage.extraLarge : recommendationAnime.bannerImage}
                        episodes={recommendationAnime.episodes}
                        duration={recommendationAnime.duration}
                        year={recommendationAnime.seasonYear}
                        trending={recommendationAnime.trending}

                    />}
                    <Gap height={50} />
                    {isEmpty ? <Error /> :
                        data.map((item, key) => (
                            <CarouselCollectionPage
                                key={key}
                                items={item.data}
                                label={item.title}
                                onClickEdit={() => {
                                    setInfo('')
                                    setIsModalOpen(true)
                                    setId(item.id)
                                    setPlaceholder(item.title)
                                }}
                                onClickDelete={() => deleteCollection(item.id)}
                                to={`/collection-detail/${item.id}`}
                            />
                        ))
                    }
                </div>
                <Footer />
            </div>
            {isModalOpen && !isEmpty &&
                <ModalInput
                    placeholder={placeholder}
                    onClickCancel={() => {
                        setValue('')
                        setIsModalOpen(false)
                    }}
                    onClickClose={() => {
                        setValue('')
                        setIsModalOpen(false)
                    }}
                    onClickSave={() => editCollection(id)}
                    value={value}
                    info={info}
                    setValue={event => setValue(event.target.value)}
                />}
        </div>
    )
}

export default Collection