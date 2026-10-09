import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Services from './Services'


vi.mock('motion/react', () => ({
    m: {
        ul: ({ children, ...props }) => (
            <ul {...props}>{children}</ul>
        )
    }
}))


vi.mock('@/animations/variants.js', () => ({
    fadeInContainer: vi.fn(() => ({
        hidden: {},
        visible: {}
    })),
    fadeInUp: vi.fn(() => ({
        hidden: {},
        visible: {}
    }))
}))


vi.mock('./ServiceCard.jsx', () => ({
    default: ({ title, desc, altText }) => (
        <li>
            <h3>{title}</h3>
            <p>{desc}</p>
            <img src="test-image" alt={altText} />
        </li>
    )
}))


describe('Services', () => {

    it('renders the services section and title', () => {
        render(<Services />)

        expect(
            screen.getByRole('region')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('heading', {
                name: 'Szolgáltatásaink'
            })
        ).toBeInTheDocument()
    })


    it('renders all service cards', () => {
        render(<Services />)

        expect(
            screen.getByRole('heading', {
                name: 'Díjmentes felmérés'
            })
        ).toBeInTheDocument()

        expect(
            screen.getByRole('heading', {
                name: 'Teljeskörű telepítés'
            })
        ).toBeInTheDocument()

        expect(
            screen.getByRole('heading', {
                name: 'Karbantartás'
            })
        ).toBeInTheDocument()
    })


    it('renders the correct number of service cards', () => {
        render(<Services />)

        expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })


    it('renders the correct descriptions', () => {
        render(<Services />)

        expect(
            screen.getByText(/pontos ajánlatot adhassunk/)
        ).toBeInTheDocument()

        expect(
            screen.getByText(/szakszerű telepítését/)
        ).toBeInTheDocument()

        expect(
            screen.getByText(/rendszeres karbantartásáról/)
        ).toBeInTheDocument()
    })


    it('renders the correct alt texts', () => {
        render(<Services />)

        expect(
            screen.getByAltText('Díjmentes felmérés')
        ).toBeInTheDocument()

        expect(
            screen.getByAltText('Teljeskörű telepítés')
        ).toBeInTheDocument()

        expect(
            screen.getByAltText('Karbantartás')
        ).toBeInTheDocument()
    })
})