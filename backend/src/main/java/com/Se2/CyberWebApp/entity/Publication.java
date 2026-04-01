package com.Se2.CyberWebApp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "publications")
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    private String title;
    private String authors;

    @Column(name = "journal_name")
    private String journalName;

    @Column(name = "abstract_text", columnDefinition = "TEXT")
    private String abstractText;

    @Column(name = "publication_url")
    private String publicationUrl;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAbstractText() { return abstractText; }
    public void setAbstractText(String abstractText) { this.abstractText = abstractText; }
    public String getPublicationUrl() { return publicationUrl; }
    public void setPublicationUrl(String publicationUrl) { this.publicationUrl = publicationUrl; }
    public String getAuthors() { return authors; }
    public void setAuthors(String authors) { this.authors = authors; }
}