package org.spring.backend.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Component
public class CustomLogOutSuccessHandler implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request,
                                HttpServletResponse response,
                                Authentication authentication) throws IOException, ServletException {

        response.setContentType("text/html;charset=utf-8");

        PrintWriter out=response.getWriter();

        if(authentication==null){
            out.println("<script> " +
                    " alert(' HOME으로 이동합니다! '); " +
                    "  location.href='/'; " +   // 로그인 성공후 이전페이지
                    " </script>");
        }else {
            out.println("<script> " +
                    " alert(' "+authentication.getName()+"님 안녕히 가십시오!'); " +
                    "  location.href='/'; " +   // 로그인 성공후 이전페이지
                    " </script>");
        }

        out.close();
    }
}
