package com.ncomics.backend.modules.readingprogress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.story.entity.Story;
import com.ncomics.backend.modules.chapter.entity.Chapter;

@Entity
    @Table(name = "reading_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uk_reading_progress_user_story", columnNames = {"user_id", "story_id"})
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber = 0;

    @Column(name = "progress_percent", nullable = false)
    private Integer progressPercent = 0;

    @Column(name = "last_read_at", nullable = false)
    private LocalDateTime lastReadAt;
}

