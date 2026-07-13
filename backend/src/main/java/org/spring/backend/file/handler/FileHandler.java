package org.spring.backend.file.handler;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.spring.backend.common.TableType;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.file.entity.FileEntity;
import org.spring.backend.file.repository.FileRepository;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
//공통 파일 유틸리티(파일삭제, 파일생성)
public class FileHandler {
    private final FileRepository fileRepository;
    private final MemberRepository memberRepository;
    private final CommunityRepository communityRepository;
//    private final ProductRepository productRepository;
    //파일삭제
    @Transactional
    public void deleteFile(String filePath, TableType tableType, Long id)
    throws IOException {
        Optional<FileEntity> optionalFileEntity = Optional.empty();
        switch (tableType){
            case MEMBER -> optionalFileEntity = fileRepository.findByMemberEntity(memberRepository.findById(id).orElseThrow(()->new NoSuchElementException("존재하지않는 멤버입니다.")));
            case COMMUNITY -> optionalFileEntity = fileRepository.findByCommunityEntity(
                    communityRepository.findById(id).orElseThrow(()->new NoSuchElementException("존재하지않는 게시글입니다."))
            );
            default -> throw new IllegalArgumentException("tableType이 존재하지 않습니다.");
        }

        if(optionalFileEntity.isEmpty()){
            throw new NullPointerException("파일엔티티의 값이 존재하지 않습니다.");
        }
        try {
//            URI fileUri = new URI(filePath + optionalFileEntity.get().getNewFileName());
//            File deleteFile = new File(fileUri);
            //테스트시에는 경로uri사용할수 없기에 로컬로 사용
            String localPath = filePath.replace("file://", "");
            Path targetFilePath = Paths.get(localPath).resolve(optionalFileEntity.get().getNewFileName());
            File deleteFile = targetFilePath.toFile();
            if (deleteFile.exists()) deleteFile.delete();
            fileRepository.delete(optionalFileEntity.get());
        } catch (Exception e) {
            System.out.println("파일 삭제 중 에러 : " + e.getMessage());
            throw new IOException("파일삭제에 실패하였습니다.");
        }
    }

    //단일파일 저장
    public void insertFile(String filePath, TableType tableType, Long id, MultipartFile file)
    throws IOException{
        try{
            Optional<FileEntity> optionalFileEntity = Optional.empty();
            FileEntity fileEntity = null;
            String oldFileName = file.getOriginalFilename();
            String newFileName = UUID.randomUUID() + "_" + oldFileName;
            switch (tableType){
                case MEMBER -> {
                    MemberEntity memberEntity = memberRepository.findById(id)
                            .orElseThrow(()-> new IllegalArgumentException("회원정보가 없습니다."));
                    optionalFileEntity = fileRepository.findByMemberEntity(memberEntity);
                    fileEntity = FileEntity.builder()
                            .oldFileName(oldFileName)
                            .newFileName(newFileName)
                            .tableType(tableType)
                            .memberEntity(memberEntity)
                            .build();
                }
                case COMMUNITY -> {
                    CommunityEntity communityEntity = communityRepository.findById(id)
                            .orElseThrow(()-> new IllegalArgumentException("회원정보가 없습니다."));
                    optionalFileEntity = fileRepository.findByCommunityEntity(communityEntity);
                    fileEntity = FileEntity.builder()
                            .oldFileName(oldFileName)
                            .newFileName(newFileName)
                            .tableType(tableType)
                            .communityEntity(communityEntity)
                            .build();
                }
                case PRODUCT -> {
//                    optionalFileEntity = fileRepository.findByProductId(id);
                    fileEntity = FileEntity.builder()
                            .oldFileName(oldFileName)
                            .newFileName(newFileName)
                            .tableType(tableType)
                            .memberEntity(memberRepository.findById(id)
                                    .orElseThrow(()-> new IllegalArgumentException("회원정보가 없습니다.")))
                            .build();
                }
                default -> throw new IllegalArgumentException("tableType이 존재하지 않습니다.");
            }

            // file:///E:/fitmate/backend/member/와 파일명을 조합하여 URI 생성
//            URI fileUri = new URI(filePath + optionalFileEntity.get().getNewFileName());
//            File deleteFile = new File(fileUri);
            //테스트시에는 경로uri사용할수 없기에 로컬로 사용
            String localPath = filePath.replace("file://","");
            Path targetPath = Paths.get(localPath).resolve(newFileName);
            //만약 폴더가 없을때는 생성
            if(!Files.exists(targetPath.getParent())) Files.createDirectories(targetPath.getParent());
            //파일 저장
            file.transferTo(targetPath.toFile());
            fileRepository.save(fileEntity);
        }catch (Exception e){
            System.out.println("파일 저장 중 에러 발생: " + e.getMessage());
            throw new IOException("파일저장에 실패하였습니다.");
        }
    }
    //파일 여러개 저장
    public void insertMultipleFile(String filePath, TableType tableType, Long id, MultipartFile file)
    throws IOException{

    }
}
