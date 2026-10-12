package com.ncomics.backend.modules.rating.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.story.entity.Story;

@Entity
    @Table(name = "ratings", uniqueConstraints = {
        @UniqueConstraint(name = "uk_ratings_user_story", columnNames = {"user_id", "story_id"})
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @Column(nullable = false)
    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String review;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

