'use client';

import React from 'react';

export default function AiViewSkeleton({ type = 'card', title = 'Generating your results', subtitle = 'This usually takes a few seconds.' }) {
    const renderBody = () => {
        if (type === 'resume') {
            return (
                <>
                    <div className="skeleton-grid">
                        <div className="skeleton-card-panel">
                            <div className="skeleton-block skeleton-block--title" />
                            <div className="skeleton-block" />
                            <div className="skeleton-block" />
                            <div className="skeleton-block skeleton-block--short" />
                        </div>
                        <div className="skeleton-card-panel">
                            <div className="skeleton-block skeleton-block--title" />
                            <div className="skeleton-block" />
                            <div className="skeleton-block" />
                        </div>
                    </div>
                    <div className="skeleton-list">
                        <div className="skeleton-block" />
                        <div className="skeleton-block" />
                        <div className="skeleton-block skeleton-block--short" />
                    </div>
                </>
            );
        }

        if (type === 'mock') {
            return (
                <div className="skeleton-grid">
                    <div className="skeleton-card-panel">
                        <div className="skeleton-block skeleton-block--title" />
                        <div className="skeleton-block" />
                        <div className="skeleton-block" />
                        <div className="skeleton-block skeleton-block--short" />
                    </div>
                    <div className="skeleton-card-panel">
                        <div className="skeleton-block skeleton-block--title" />
                        <div className="skeleton-block" />
                        <div className="skeleton-block" />
                    </div>
                </div>
            );
        }

        if (type === 'kanban') {
            return (
                <div className="skeleton-kanban">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div className="skeleton-card-panel" key={index}>
                            <div className="skeleton-block skeleton-block--title" />
                            <div className="skeleton-block" />
                            <div className="skeleton-block skeleton-block--short" />
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="skeleton-card-panel">
                <div className="skeleton-block skeleton-block--title" />
                <div className="skeleton-block" />
                <div className="skeleton-block" />
            </div>
        );
    };

    return (
        <div className="ai-skeleton-shell" role="status" aria-live="polite">
            <div className="ai-skeleton-card">
                <div className="ai-skeleton-header">
                    <div className="skeleton-block skeleton-block--title" />
                    <div className="skeleton-block skeleton-block--line" />
                    <div className="skeleton-block skeleton-block--line skeleton-block--short" />
                </div>
                {renderBody()}
            </div>
        </div>
    );
}
