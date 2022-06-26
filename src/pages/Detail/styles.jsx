/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const breakpoints = [992]
const mq = breakpoints.map(
    bp => `@media (min-width: ${bp}px)`
)

const main = css({
    display: 'flex',
    flexDirection: 'column',
    'h1,h3,p': {
        margin: 0
    }
})

const container = css({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1248,
    [mq[0]]: {
        paddingTop: 70,
    },
})

const bundle = css({
    padding: '0px 16px',
})

export const styles = {
    main,
    container,
    bundle
}
