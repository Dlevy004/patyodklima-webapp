import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ServiceCard from './ServiceCard'


vi.mock('motion/react', () => {
    const MotionLi = ({ children, variants, ...props }) => (
        <li {...props}>{children}</li>
    )

    const motion = { li: MotionLi }

    return { motion, m: motion }
})


describe('ServiceCard', () => {
    const defaultProps = {
        imgSrc: '/test-image.jpg',
        title: 'Díjmentes felmérés',
        IconComponent: () => <svg data-testid="service-icon" />,
        desc: 'Az előzetes egyeztetést követően személyesen mérjük fel a helyszínt.',
        altText: 'Díjmentes felmérés',
        variants: {
            hidden: {},
            visible: {}
        }
    }

    it('renders the service card', async () => {
        render(<ServiceCard {...defaultProps} />)

        const texts = await screen.findAllByText('Díjmentes felmérés');
        expect(texts).toHaveLength(2);
    })

    it('renders the image with the correct attributes', () => {
        render(<ServiceCard {...defaultProps} />)

        const image = screen.getByRole('img')

        expect(image).toHaveAttribute('src', '/test-image.jpg')
        expect(image).toHaveAttribute('alt', 'Díjmentes felmérés')
        expect(image).toHaveAttribute('loading', 'lazy')
    })

    it('renders the title on both sides of the card', () => {
        render(<ServiceCard {...defaultProps} />)

        expect(
            screen.getAllByRole('heading', {
                name: 'Díjmentes felmérés'
            })
        ).toHaveLength(2)
    })

    it('renders the description', () => {
        render(<ServiceCard {...defaultProps} />)

        expect(
            screen.getByText(
                'Az előzetes egyeztetést követően személyesen mérjük fel a helyszínt.'
            )
        ).toBeInTheDocument()
    })

    it('renders the service icon', () => {
        render(<ServiceCard {...defaultProps} />)

        expect(
            screen.getByTestId('service-icon')
        ).toBeInTheDocument()
    })

    it('renders the Bővebben text', () => {
        render(<ServiceCard {...defaultProps} />)

        expect(
            screen.getByText('Bővebben')
        ).toBeInTheDocument()
    })

    it('is not flipped initially', () => {
        render(<ServiceCard {...defaultProps} />)

        const card = screen.getByRole('button')

        expect(card).not.toHaveClass('is-flipped')
    })

    it('flips the card when clicked', () => {
        render(<ServiceCard {...defaultProps} />)

        const card = screen.getByRole('button')

        fireEvent.click(card)

        expect(card).toHaveClass('is-flipped')
    })

    it('flips the card back when clicked twice', () => {
        render(<ServiceCard {...defaultProps} />)

        const card = screen.getByRole('button')

        fireEvent.click(card)

        expect(card).toHaveClass('is-flipped')

        fireEvent.click(card)

        expect(card).not.toHaveClass('is-flipped')
    })
})