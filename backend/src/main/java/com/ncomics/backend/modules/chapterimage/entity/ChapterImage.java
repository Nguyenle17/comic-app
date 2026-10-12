package com.ncomics.backend.modules.chapterimage.entity;

import jakarta.persistence.*;
import lombok.*;
import com.ncomics.backend.modules.chapter.entity.Chapter;

@Entity
    @Table(name = "chapter_images", uniqueConstraints = {
        @UniqueConstraint(name = "uk_chapter_images_page", columnNames = {"chapter_id", "page_number"})
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber;

    private Integer width;
    private Integer height;
}

