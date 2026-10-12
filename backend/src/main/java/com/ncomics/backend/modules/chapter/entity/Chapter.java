package com.ncomics.backend.modules.chapter.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.ncomics.backend.modules.story.entity.Story;

@Entity
    @Table(name = "chapters", uniqueConstraints = {
        @UniqueConstraint(name = "uk_chapters_story_number", columnNames = {"story_id", "chapter_number"})
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @Column(name = "chapter_number", nullable = false)
    private Integer chapterNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_free", nullable = false)
    private boolean free = true;

    @Column(name = "price_coin", nullable = false)
    private Integer priceCoin = 0;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(nullable = false, length = 20)
    private String status = "DRAFT";

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}

